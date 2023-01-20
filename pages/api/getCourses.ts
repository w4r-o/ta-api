// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const cheerio = require("cheerio");
//@ts-ignore
import { fetch as cookieFetch, CookieJar } from "node-fetch-cookies";

type Data = {
  response: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const username = req.body.username;
  const password = req.body.password;

  const cookieJar = new CookieJar();

  cookieFetch(
    cookieJar,
    `https://ta.yrdsb.ca/live/index.php?username=${username}&password=${password}&submit=Login&subject_id=0`,
    {
      method: "POST",
      body: "credentials",
    }
  )
    .then((data: any) => {
      data
        .text()
        .then((data: any) => {
          const $ = cheerio.load(data);
          let courses: any = [];
          //parse html
          $(".green_border_message div table tr").each((i: any, elem: any) => {
            const link = $(elem).find("a").attr("href");
            let course = $(elem).text().split("\n");
            // trim whitespace
            let filteredCourse = [];
            for (let i = 0; i < course.length; i++) {
              course[i] = course[i].trim();
              if (course[i].length > 0) {
                filteredCourse.push(course[i]);
              }
            }
            if (filteredCourse.length > 3) {
              const jsonCourse = {
                code: filteredCourse[0].split(" : ")[0],
                name: filteredCourse[0].split(" : ")[1],
                block: filteredCourse[1].replace("Block: ", "").split(" ")[0],
                room: filteredCourse[1].split("rm. ", "")[1],
                start_date: filteredCourse[2].split(" ")[0],
                end_date: filteredCourse[3].trim(),
                overall_mark: filteredCourse[4].trim(),
                link: link,
              };
              courses.push(jsonCourse);
            }
          });

          //recurse through courses to get data
          let i = 0;
          function getCourseData() {
            if (i < courses.length) {
              cookieFetch(
                cookieJar,
                "https://ta.yrdsb.ca/live/students/" + courses[i].link,
                {
                  method: "POST",
                  body: "credentials",
                }
              )
                .then((res: any) => {
                  res
                    .text()
                    .then((res: any) => {
                      if (res.includes("Invalid Login")) {
                        res.status(401).json({
                          response: "Invalid Login",
                        });
                        return;
                      } else if (res.includes("Access Denied")) {
                        res.status(403).json({
                          response: "Access Denied",
                        });
                        return;
                      } else if (res.includes("Session Expired")) {
                        res.status(401).json({
                          response: "Session Expired",
                        });
                        return;
                      }
                      const $ = cheerio.load(res);

                      //assignments
                      let assignments: any = [];
                      let counter = 1;
                      $('table[width="100%"]')
                        .children()
                        .children()
                        .each((i: any, elem: any) => {
                          counter++;
                          if (counter % 2 === 0) return;

                          let assignment: any = {};

                          assignment.name = $(elem)
                            .find('td[rowspan="2"]')
                            .text()
                            .replaceAll("\t", "");

                          [
                            ["KU", "ffffaa"],
                            ["A", "ffd490"],
                            ["T", "c0fea4"],
                            ["C", "afafff"],
                          ].forEach((item) => {
                            const category = $(elem)
                              .find(`td[bgcolor="${item[1]}"]`)
                              .text()
                              .replaceAll("\t", "")
                              .trim();
                            assignment[item[0]] = {
                              get: category ? category.split(" / ")[0] : 0,
                              total: category
                                ? category.split(" / ")[1].split(" = ")[0]
                                : 0,
                              weight: category
                                ? category.split("weight=")[1].split("\n")[0]
                                : 0,
                              finished: category
                                ? !category.includes("finished")
                                : true,
                            };
                          });
                          assignments.push(assignment);
                        });

                      // weight_table
                      let weight_table: any = {};
                      [
                        ["KU", "ffffaa"],
                        ["A", "ffd490"],
                        ["T", "c0fea4"],
                        ["C", "afafff"],
                        ["O", "eeeeee"],
                        ["F", "cccccc"],
                      ].forEach((item) => {
                        const weights: any = [];

                        $('table[cellpadding="5"]')
                          .find(`tr[bgcolor="#${item[1]}"]`)
                          .children()
                          .each((i: any, elem: any) => {
                            weights.push($(elem).text().trim());
                          });

                        weight_table[item[0]] = {
                          W: weights[1],
                          CW: weights[2],
                          SA: weights[3],
                        };
                      });

                      courses[i].assignments = [...assignments];
                      courses[i].weight_table = { ...weight_table };

                      i++;
                      getCourseData();
                    })
                    .catch((err: any) => {
                      throw err;
                    });
                })
                .catch((err: any) => {
                  throw err;
                });
            } else {
              res.status(200).json({
                response: courses,
              });
            }
          }
          getCourseData();
        })
        .catch((err: any) => {
          throw err;
        });
    })
    .catch((err: any) => {
      res.status(500).json({
        response: err,
      });
    });
}
