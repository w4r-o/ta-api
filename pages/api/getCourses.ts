// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const cheerio = require("cheerio");
const Cors = require("cors");
//@ts-ignore
import { fetch as cookieFetch, CookieJar } from "node-fetch-cookies";

type Data = {
  response: any;
};

const cors = Cors({
  methods: ["POST"],
});

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  runMiddleware(req, res, cors);

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
                block: filteredCourse[1].replace("Block: P", "").split(" ")[0],
                room: filteredCourse[1].split("rm. ")[1],
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
                          response: { error: "Invalid Login" },
                        });
                        return;
                      } else if (res.includes("Access Denied")) {
                        res.status(403).json({
                          response: { error: "Access Denied" },
                        });
                        return;
                      } else if (res.includes("Session Expired")) {
                        res.status(401).json({
                          response: { error: "Session Expired" },
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
                          if (counter % 2 === 0) {
                            if (counter > 2) {
                              assignments[assignments.length - 1].feedback = $(
                                elem
                              )
                                .text()
                                .trim();
                            }
                            return;
                          }

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
                            ["O", "eeeeee"],
                            ["F", "cccccc"],
                          ].forEach((item) => {
                            const category = $(elem)
                              .find(`td[bgcolor="${item[1]}"]`)
                              .text()
                              .replaceAll("\t", "")
                              .trim();
                            if (category) {
                              try {
                                assignment[item[0]] = {
                                  get: parseFloat(category.split(" / ")[0]),
                                  total: parseFloat(
                                    category.split(" / ")[1].split(" = ")[0]
                                  ),
                                  weight: parseFloat(
                                    category.split("weight=")[1].split("\n")[0]
                                  ),
                                  finished: !category.includes("finished"),
                                };
                              } catch (e) {
                                assignment[item[0]] = {
                                  get: 0,
                                  total: 0,
                                  weight: 0,
                                  finished: true,
                                };
                              }
                            }
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

                        try {
                          let index = 1;
                          if (weights[0].includes("Final")) {
                            index = 0;
                            weights[index] = "0%";
                          }
                          weight_table[item[0]] = {
                            W: parseFloat(weights[index].replace("%", "")),
                            CW: parseFloat(weights[index + 1].replace("%", "")),
                            SA: parseFloat(weights[index + 2].replace("%", "")),
                          };
                        } catch (err) {
                          return;
                        }
                      });

                      if (assignments.length === 0) {
                        assignments = [];
                      }

                      if (Object.keys(weight_table).length === 0) {
                        weight_table = {};
                      }

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
        response: { error: err },
      });
    });
}
