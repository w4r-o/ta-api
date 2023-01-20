// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import makeFetchCookie from "fetch-cookie";
const cheerio = require("cheerio");

type Data = {
  response: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const username = req.body.username;
  const password = req.body.password;

  const fetchCookie = makeFetchCookie(fetch);

  fetchCookie(
    `https://ta.yrdsb.ca/live/index.php?username=${username}&password=${password}&submit=Login&subject_id=0`,
    {
      method: "POST",
      credentials: "include",
    }
  )
    .then((data: any) => {
      console.log(data.headers);
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

        res.status(200).json({
          response: courses,
        });
      });
    })

    .catch((err: any) => {
      res.status(500).json({
        response: "error: " + err,
      });
    });
}
