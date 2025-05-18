import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppNavbar from "../components/Navbar";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Modal,
  Stack,
  Table,
} from "react-bootstrap";
import api from "../utils/api";
import parseHTMLToFiles from "../utils/parseHTMLToFiles";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [website, setWebsite] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [scrapedData, setScrapedData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  // New states for invited users modal
  const [showInvitedUsersModal, setShowInvitedUsersModal] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    if (!token || !user) {
      router.push("/signin");
      return;
    }

    const parsedUser = JSON.parse(user);
    api
      .get("/auth/verify", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setUser(parsedUser);
        fetchScrapedData(parsedUser.id);
      })
      .catch(() => router.push("/signin"));
  }, []);

  const fetchScrapedData = async (userId) => {
    try {
      const res = await api.get("/workspace/scrapedWebsiteList", {
        headers: {
          userid: userId,
        },
      });
      setScrapedData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch scraped data:", err);
    }
  };

  const toggleReadMore = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleScrape = async () => {
    if (!website || !user) return;

    try {
      const response = await api.post(
        "/workspace/scrape",
        new URLSearchParams({ url: website }), // mimics `application/x-www-form-urlencoded`
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            userId: user.id, // user.id from session
          },
        }
      );

    const { data, content_id } = response.data;

    // Step 2: Parse scraped HTML into file structure
    const files = parseHTMLToFiles(data); // returns array of { name, path, type, html }
      console.log('------------------files--->', files);
    // Step 3: Save structured content to backend
    await api.post("/workspace/save-scraped-content", {
      contentId: content_id,
      files,
    });

      console.log("Scrape Success:", response.data);
      fetchScrapedData(user.id); // Refresh the table
      setWebsite(""); // Optional: clear input after scraping
      router.push(`/edit?id=${response.data.content_id}`);
    } catch (error) {
      console.error("Scrape Failed:", error);
    }
  };

  const handleInvite = async (inviteEmail) => {
    try {
      const payload = {
        email: user.email,
        id: user.id,
        inviter_email: inviteEmail,
        content_id: selectedRowId,
      };
      console.log("=------payload---------->", payload);
      const response = await api.post("/team/invite", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(response.data.message);
    } catch (err) {
      console.error("Error sending invite:", err);
    } finally {
      setShowInviteModal(false);
      setInviteEmail("");
    }
  };

    // Fetch invited users list API call
  const fetchInvitedUsers = async () => {
    if (!user) return;
    try {
      const res = await api.post("/team/invitedMembersList", {}, {
        headers: {
          userid: user.id,
        },
      });
      setInvitedUsers(res.data.data); // Assuming your API returns { data: [...] }
      setShowInvitedUsersModal(true);
    } catch (err) {
      console.error("Failed to fetch invited users:", err);
      alert("Failed to load invited users.");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center mb-4"
        >
          <div className="p-2">
            <h2 className="mb-0">Dashboard</h2>
            {user && <p className="mb-0">Welcome, {user.name}</p>}
          </div>

          <div className="ms-auto d-flex align-items-center gap-3">
             <Button variant="primary" onClick={fetchInvitedUsers}>
              View Invited Users
            </Button>
          </div>
        </Stack>

        <Stack direction="horizontal" gap={3}>
          <Form.Control
            className="me-auto"
            type="text"
            placeholder="Enter website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Button variant="secondary" onClick={handleScrape}>
            Scrape
          </Button>
        </Stack>

        {scrapedData.length > 0 ? (
          <>
            <h4 className="mt-5">Scraped Websites</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Website</th>
                  <th>Scraped Data</th>
                  <th>Scraped At</th>
                  <th>Invite</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scrapedData.length > 0 ? (
                  scrapedData.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.url}</td>
                      <td>
                        {item.scrapedData
                          ? expandedRows[index]
                            ? item.scrapedData
                            : item.scrapedData.slice(0, 200) +
                              (item.scrapedData.length > 200 ? "..." : "")
                          : "Completed"}
                        {item.scrapedData && item.scrapedData.length > 200 && (
                          <span
                            onClick={() => toggleReadMore(index)}
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              marginLeft: 8,
                            }}
                          >
                            {expandedRows[index] ? "Show Less" : "Read More"}
                          </span>
                        )}
                      </td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td>
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setSelectedRowId(item.id);
                            setShowInviteModal(true);
                          }}
                        >
                          Invite Member
                        </Button>
                      </td>
                      <td>
                        <Button
                          className="mt-2"
                          onClick={() =>
                            router.push(`/edit?id=${item.id}`)
                          }
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        ) : (
          ""
        )}

        {/* Invite Team Member Modal */}
        <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Invite Team Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="inviteEmail">
                <Form.Label>Team Member Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleInvite(inviteEmail)}>
              Send Invite
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showInvitedUsersModal}
          onHide={() => setShowInvitedUsersModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Invited Users List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {invitedUsers.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invitedUsers.map((invite, idx) => (
                    <tr key={invite.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{invite.member_email}</td>
                      <td>{invite.status}</td> {/* Adjust field names based on API */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No invited users found.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInvitedUsersModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
