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
      data.text().then((data: any) => {
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
              .then((data: any) => {
                data.text().then((data: any) => {
                  courses[i].data = data;
                  i++;
                  getCourseData();
                });
              })
              .catch((err: any) => {
                res.status(500).json({
                  response: "error: " + err,
                });
              });
          } else {
            res.status(200).json({
              response: courses,
            });
          }
        }

        getCourseData();
      });
    })

    .catch((err: any) => {
      res.status(500).json({
        response: "error: " + err,
      });
    });
}
