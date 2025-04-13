import { Helmet } from "react-helmet-async";

const metadata = { title: `Settings` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <div>
                tda
            </div>
        </>
    )
}