// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import api from '../utils/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await api.post('api/auth/signup', { name, email, password });
      router.push('/signin');
    } catch (err) {
      alert('Error while registering, Try with different email!');
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <h2>Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Button className="mt-3" type="submit">Sign Up</Button>
        </Form>
      </Container>
    </>
  );
}
