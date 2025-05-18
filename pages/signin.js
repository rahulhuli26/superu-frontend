import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import api from '../utils/api';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { token, user } = response.data;
      console.log('------>',response, token, user)
       // Store in sessionStorage or localStorage
      sessionStorage.setItem('token', token); // or localStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log('----------20------>')
      router.push('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <h2>Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Button className="mt-3" type="submit">Sign In</Button>
        </Form>
      </Container>
    </>
  );
}