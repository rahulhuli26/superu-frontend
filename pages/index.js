import AppNavbar from '../components/Navbar';
import { Container } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <h1>Welcome to the SuperU</h1>
      </Container>
    </>
  );
}