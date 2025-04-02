import { config } from "@/lib/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req:NextRequest) => {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const videoId = params.videoId as string;
    const res = await axios.get(`
        https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${config.YOUTUBE_API_KEY}`,{
            headers:{
                'Referer': 'https://localhost:3000'
            }
        });
      const { data } = res;
    return NextResponse.json({title: data.items[0].snippet.title});
};

export { handler as GET };

