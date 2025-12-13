import { gql } from "@apollo/client";

export const GET_LEADERBOARD = gql`
    query GetLeaderboard {
        leaderboard(timeframe: ALL_TIME) {
            firstName
            lastName
            profilePictureUrl
            stats(timeframe: ALL_TIME) {
                verticalDistance(system: IMPERIAL)
                topSpeed(system: IMPERIAL)
                runCount
            }
        }
    }
`;
