
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
// bhj/v

function App() {
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('https://wolves-k2v8.onrender.com/api/records');
      console.log(response.data)
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      images.forEach((image) => {
        formData.append('images', image);
      });

      const x = await axios.post('https://wolves-k2v8.onrender.com/api/records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // const val = await x.status();
      // console.log(val)
      console.log(5)
      // Clear form data
      setTitle('');
      setDescription('');
      setImages([]);

      // Refresh records
      fetchRecords();
    } catch (error) {
      console.log(error);
    }
  };

  let arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            multiple
            style={{ display: 'none' }}
            id="upload-input"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              // startIcon={<CloudUpload />}
            >
              Upload Images
            </Button>
          </label>
          {images.length > 0 && (
            <ul>
              {images.map((image, index) => (
                <li key={index}>{image.name}</li>
              ))}
            </ul>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Add Record
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {records.map((record) => (
              <Grid item xs={12} sm={6} md={4} key={record._id}>
                <Card>
                  <CardContent>
                    <h3>{record.title}</h3>
                    <p>{record.description}</p>
                    <div>
                      {record.images.map((image, index) => (
                        JSON.stringify(arrayBufferToBase64(image.data.data))
                        
                      ))}
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="secondary">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
