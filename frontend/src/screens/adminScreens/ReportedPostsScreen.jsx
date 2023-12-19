import { useEffect, useState } from "react";
import { useGetReportedPostsMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";
import ReportedPostsTable from "../../components/adminComponents/ReportedPostsTable.jsx";
import { Container } from "react-bootstrap";

const ReportedPostsScreen = () => {
    const [reportedPosts, setReportedPosts] = useState([]);
    const [getReportedPosts, { isLoading }] = useGetReportedPostsMutation();

    useEffect(() => {
        const fetchReportedPosts = async () => {
            try {
                const response = await getReportedPosts();
                console.log("response reported posts: ", response);
                setReportedPosts(response.data);
            } catch (error) {
                console.error("Error fetching reported posts:", error);
            }
        };

        fetchReportedPosts();
    }, [getReportedPosts]);

    return (
        <Container>
            <h1 className="p-2">Reported Posts</h1>
            {isLoading ? <Loader /> : <ReportedPostsTable reportedPosts={reportedPosts} setReportedPosts={setReportedPosts} />}
        </Container>
    );
};

export default ReportedPostsScreen;
