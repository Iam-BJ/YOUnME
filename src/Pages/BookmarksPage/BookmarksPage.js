import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, message, Popconfirm, Popover, Row } from "antd";
import { CaretRightOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Footer from "../../Components/Footer/Footer";
import { db } from "../../firebase";
import handleAddCourse from "../../firestore/addCourse";
import { UserContext } from "../../UserContext";
import "./BookmarksPage.css";

const { Meta } = Card;

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const { uid } = useContext(UserContext);

  useEffect(() => {
    // Fetch bookmarks when the component mounts or uid changes
    (async function fetchBookmarks() {
      try {
        const doc = await db.collection("users").doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          setBookmarks(data.bookmarks || []); // Ensure bookmarks is always an array
        } else {
          setBookmarks([]); // Handle the case where the user document does not exist
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setBookmarks([]); // Set an empty array on error
      }
    })();
  }, [uid]);

  const handleDeleteBookmark = async (playlistID) => {
    const hide = message.loading("Deleting from the Database...", 0);
    try {
      const data = await db.collection("users").doc(uid).get();
      let bookmarks = data.data().bookmarks || [];
      const filteredBookmarks = bookmarks.filter((value) => value.playlistID !== playlistID);
      await db.collection("users").doc(uid).set({ bookmarks: filteredBookmarks });
      setBookmarks(filteredBookmarks);
      message.success("Bookmark Removed Successfully, Refresh the page");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      message.error("Failed to remove bookmark");
    } finally {
      setTimeout(hide, 0);
    }
  };

  return (
    <div className="wrapper____">
      {bookmarks.length === 0 ? (
        <h2 style={{ paddingTop: 100, textAlign: "center" }}>
          No Bookmarks Added
        </h2>
      ) : (
        <Row gutter={[16, 24]}>
          {bookmarks.map((playlist) => (
            <Col className="gutter-row" span={6} key={playlist.playlistID}>
              <Card
                cover={<img alt="example" src={playlist.thumbnail} />}
                style={{ width: 300, margin: 0 }}
                actions={[
                  <Popover content="Open in the player">
                    <Link
                      to={{
                        pathname: "/video-player",
                        playlistID: playlist.playlistID,
                        tracking: false,
                      }}
                    >
                      <CaretRightOutlined key="play" />
                    </Link>
                  </Popover>,
                  <Popover title="Enroll in course and start tracking it">
                    <PlusCircleOutlined
                      key="Enroll"
                      onClick={() => {
                        handleAddCourse(playlist.playlistID, uid);
                      }}
                    />
                  </Popover>,
                  <Popconfirm
                    title="Are you sure you wanna delete this?"
                    onConfirm={() => {
                      handleDeleteBookmark(playlist.playlistID);
                    }}
                  >
                    <DeleteOutlined key="edit" />
                  </Popconfirm>,
                ]}
              >
                <Meta title={playlist.title} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Footer />
    </div>
  );
}
