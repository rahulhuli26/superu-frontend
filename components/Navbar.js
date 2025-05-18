import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AppNavbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (token && user) {
      setLoggedIn(true);
    } else {
      api
        .get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => setLoggedIn(true))
        .catch(() => setLoggedIn(false));
    }
  }, []);

  const logout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link href="/" className="navbar-brand">
          SuperU
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {loggedIn && (
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}
          </Nav>
          <Nav>
            {!loggedIn ? (
              <>
                <Link href="/signin" className="nav-link">
                  Sign In
                </Link>
                <Link href="/signup" className="nav-link">
                  Sign Up
                </Link>
              </>
            ) : (
              <Button onClick={logout} variant="outline-light">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
