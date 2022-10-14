import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { accountsSeenByUser } from "../../state/accounts";
import AccountSelect, { AccountSelectProps } from "../style/AccountSelect";
import { pendingTransactionDetailChanges, Transaction } from "../../state/transactions";
import { Group } from "../../state/groups";

type Props = {
    group: Group;
    transaction: Transaction;
    isEditing: boolean;
    onChange?: AccountSelectProps["onChange"];
} & Omit<AccountSelectProps, "onChange">;

export const TransactionDebitorShare: React.FC<Props> = ({ group, transaction, isEditing, ...props }) => {
    const accounts = useRecoilValue(accountsSeenByUser(group.id));
    const shareAccountID =
        Object.keys(transaction.debitor_shares).length === 0 ? null : Object.keys(transaction.debitor_shares)[0];
    const setLocalTransactionDetails = useSetRecoilState(pendingTransactionDetailChanges(transaction.id));

    const getAccount = (accountID) => {
        return accounts.find((account) => account.id === accountID);
    };

    const onDebitorShareChange = (account) => {
        if (account === null) {
            return; // TODO: some error handling
        }
        if (shareAccountID !== account.id) {
            setLocalTransactionDetails((currState) => {
                return {
                    ...currState,
                    debitor_shares: {
                        [account.id]: 1.0,
                    },
                };
            });
        }
    };

    return (
        <AccountSelect
            group={group}
            noDisabledStyling={true}
            value={shareAccountID === null ? null : getAccount(parseInt(shareAccountID))}
            onChange={onDebitorShareChange}
            disabled={!isEditing}
            {...props}
        />
    );
};

export default TransactionDebitorShare;