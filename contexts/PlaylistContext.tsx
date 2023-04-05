import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import useSpotify from "../hooks/useSpotify";
import { IPlaylistContext, PlaylistContextState } from "../types";

const defaultPlaylistContextState: PlaylistContextState = {
  playlist: [],
  selectedPlaylistId: null,
  selectedPlaylist: null,
};

export const PlaylistContext = createContext<IPlaylistContext>({
  playlistContextState: defaultPlaylistContextState,
  updatePlaylistContextState: () => {},
});

export const usePlaylistContext = () => useContext(PlaylistContext);

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [playlistContextState, setPlaylistContextState] = useState(
    defaultPlaylistContextState
  );

  const updatePlaylistContextState = (
    updateObj: Partial<PlaylistContextState>
  ) => {
    setPlaylistContextState((prev) => ({ ...prev, ...updateObj }));
  };

  useEffect(() => {
    const getUserPlaylist = async () => {
      const userPlaylistResponse = await spotifyApi.getUserPlaylists();
      updatePlaylistContextState({ playlist: userPlaylistResponse.body.items });
    };

    if (spotifyApi.getAccessToken()) {
      getUserPlaylist();
    }
  }, [session, spotifyApi]);

  const playlistContextProviderData = {
    playlistContextState,
    updatePlaylistContextState,
  };

  return (
    <PlaylistContext.Provider value={playlistContextProviderData}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContextProvider;
