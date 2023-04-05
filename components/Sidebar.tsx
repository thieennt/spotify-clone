import React from "react";
import {
  HomeIcon,
  HeartIcon,
  BookmarkIcon,
  PlusCircleIcon,
  RssIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import IconButton from "./IconButton";
import { signOut, useSession } from "next-auth/react";
import { usePlaylistContext } from "../contexts/PlaylistContext";
import useSpotify from "../hooks/useSpotify";

const Divider = () => <hr className="border-t-[0.1px] border-gray-900" />;

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const {
    playlistContextState: playlists,
    updatePlaylistContextState: updatePlaylist,
  } = usePlaylistContext();

  const setSelectedPlaylist = async (playlistId: string) => {
    const playlistResponse = await spotifyApi.getPlaylist(playlistId);
    updatePlaylist({
      selectedPlaylistId: playlistId,
      selectedPlaylist: playlistResponse.body,
    });
  };

  return (
    <div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hidden sm:maw-w-[12rem] lg:max-w-[15rem] hidden md:block">
      <div className="space-y-4">
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={BookmarkIcon} label="Your Library" />

        <Divider />

        <IconButton icon={PlusCircleIcon} label="Create Playlist" />
        <IconButton icon={HeartIcon} label="Like Songs" />
        <IconButton icon={RssIcon} label="Your Episodes" />

        <Divider />

        {/* Playlist */}
        {playlists.playlist.map((item) => (
          <p
            key={item.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setSelectedPlaylist(item.id)}
          >
            {item.name}
          </p>
        ))}
        <Divider />

        {/* Log out */}
        {session?.user && (
          <>
            <p>{session.user.name}</p>
            <button onClick={() => signOut()}>Log out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
