"use client";

import React from "react";
import ReactPlayer from "react-player";

import { decode, encode } from "@/lib/url";
import Link from "next/link";

const DEFAULT_BOARD =
  "N4IgLglmA2CmIC4QDkIAc1wAQCED2AhgE4AmIANCAG4Qmx4DOiA2qDXXgJJlIAKArAE4A1sIB2AeQCMAdwCKATQogx6TLCYJWIaAQBGsaIhAAJAIIAtAKrIA4soZhiYY1IBMy2GJ4gpANhAAX3JQXQMjJABZAB2AFQBRByciFyQADk9vVw9g0P1DYxN4gCVirEjOZE4AZQTipOdjPwB2TJ8-DMCAXW7AoA";

type Video = {
  videoId: string;
  nipples: [{ label: string; start: number; end: number }];
};

type Board = {
  title: string;
  videos: Video[];
};

function Video({
  video,
  toggleBuffering,
}: {
  video: Video;
  toggleBuffering: (buffering: boolean) => void;
}) {
  const playerRef = React.useRef<any>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentNipple, setCurrentNipple] = React.useState();

  return (
    <>
      <div className="w-1 h-1 overflow-hidden">
        <ReactPlayer
          playing={isPlaying}
          ref={playerRef as any}
          onBuffer={() => {
            toggleBuffering(true);
          }}
          onBufferEnd={() => {
            toggleBuffering(false);
          }}
          onProgress={({ playedSeconds }) => {
            if (!currentNipple || playedSeconds > currentNipple.end) {
              setIsPlaying(false);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          url={`https://www.youtube.com/watch?v=${video.videoId}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5">
        {video.nipples.map((nipple) => (
          <button
            key={nipple.start}
            className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold  rounded-full shadow"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(nipple.start, "seconds");
                setCurrentNipple(nipple);
                setIsPlaying(true);
              }
            }}
          >
            {nipple.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default function Player() {
  const [isBuffering, setIsBuffering] = React.useState(false);

  const hashBoard = decode(document.location.hash.substring(1));

  const board: Board =
    Object.keys(hashBoard).length > 0 ? hashBoard : decode(DEFAULT_BOARD);

  return (
    <>
      {isBuffering && (
        <div className="w-full bg-gray-300 overflow-hidden fixed top-0 left-0 text-white">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse text-center">
            Buffering
          </div>
        </div>
      )}
      <h1 className="text-3xl text-center pb-10">{board.title}</h1>
      <Link href={`/create#${encode(board)}`}>Edit</Link>

      {board.videos.map((video) => (
        <Video
          key={video.videoId}
          video={video}
          toggleBuffering={setIsBuffering}
        />
      ))}
    </>
  );
}
