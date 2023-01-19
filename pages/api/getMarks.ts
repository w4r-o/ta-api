// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import makeFetchCookie from "fetch-cookie";

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
    }
  )
    .then((data: any) => {
      console.log(data);
      data
        .text()
        .then((data: any) => {
          res.status(200).json({
            response: data,
          });
        })
        .catch((err: any) => {
          throw err;
        });
    })
    .catch((err: any) => {
      res.status(500).json({
        response: "error: " + err,
      });
    });
}
