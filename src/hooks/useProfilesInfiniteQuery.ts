import { deleteProfile, getProfiles } from "@/database/firebase";
import { changeTabName } from "@/utils/functions";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import { useState } from "react";

const useProfilesInfiniteQuery = (
  isOwner: boolean,
  tab: string,
  uid: string,
  isFiltersEmpty?: boolean,
  checkIfDocumentMatchesFilters?: (doc: DocumentData) => boolean
) => {
  const queryClient = useQueryClient();
  const [lastProfile] = useState<DocumentData | null>(null);
  const profileLimit = 6;

  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: isOwner ? ["myProfiles", tab] : ["profiles"],
      queryFn: (pageParam) => {
        return getProfiles(
          isOwner,
          changeTabName(tab),
          uid,
          pageParam.pageParam
        );
      },
      select: (data) =>
        data.pages.flatMap((snapshot) => {
          const filtered = isFiltersEmpty
            ? snapshot.docs
            : snapshot.docs.filter((doc) => {
                return (
                  checkIfDocumentMatchesFilters &&
                  checkIfDocumentMatchesFilters(doc.data())
                );
              });
          return filtered.map((doc) => {
            const {
              userId,
              game,
              genre,
              style,
              interest,
              image,
              intro,
              contact,
            } = doc.data();
            return {
              id: doc.id,
              userId,
              genre,
              tab,
              game,
              style,
              interest,
              image,
              intro,
              contact,
            };
          });
        }),
      initialPageParam: lastProfile,
      getNextPageParam: (querySnapshot) => {
        if (querySnapshot.size < profileLimit) {
          return undefined;
        } else {
          return querySnapshot.docs[querySnapshot.docs.length - 1];
        }
      },
    });

  const removeProfile = useMutation({
    mutationFn: async ({
      profileId,
      game,
    }: {
      profileId: string;
      game: string;
    }) => deleteProfile(profileId, tab, game, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfiles", tab] });
    },
  });
  return {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    removeProfile,
  };
};
export default useProfilesInfiniteQuery;
