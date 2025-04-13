import { Helmet } from "react-helmet-async";

import { UserListView } from "src/sections/settings/user/view";

const metadata = { title: `Settings` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <UserListView />
        </>
    )
}