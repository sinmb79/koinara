// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library JobTypes {
    enum JobType {
        Simple,
        General,
        Collective
    }

    enum JobState {
        Created,
        Open,
        Submitted,
        UnderVerification,
        Accepted,
        Rejected,
        Settled,
        Expired
    }

    function weight(JobType jobType) internal pure returns (uint256) {
        if (jobType == JobType.Simple) {
            return 1;
        }

        if (jobType == JobType.General) {
            return 3;
        }

        return 7;
    }

    function verifierQuorum(JobType jobType) internal pure returns (uint256) {
        if (jobType == JobType.Simple) {
            return 1;
        }

        if (jobType == JobType.General) {
            return 3;
        }

        return 5;
    }
}
