import express from 'express';
import { users,posts } from './data.js';
import { v4 as uuidv4 } from 'uuid';
const app = express();
app.use(express.json());
const PORT = 3000;
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json({
            msg: 'Tìm thấy thành công',
            data: user
        });
    } else {
        res.status(404).json({
            msg: 'Không tìm thấy user'
        });
    }
});
//API tạo user với các thông tin như trên users, với id là random (uuid), 
//email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post('/users/createUser', (req, res) => {
    const { userName, email, age, avatar } = req.body || {};
    const exitingUser = users.find(item => item.email === email);
    if (exitingUser) {
        res.status(400).json({
            msg: "Email đã tồn tại"
        })
    } else {
        if (age < 0) {
            res.status(500).json({
            msg: "Tuổi không hợp lệ"
            })
        } else {
            const id = uuidv4();
            const newUser = { id, userName, email, age, avatar };
            users.push(newUser);
            res.status(200).json(newUser);
        }
    }
});
// API để lấy ra các bài post của một user dựa trên userId truyền vào trong params
app.get('/posts/:userId', (req, res) => {
  const { userId } = req.params;
  const userPosts = posts.filter(post => post.userId === userId);
  res.json(userPosts);
});

// API để tạo bài post mới cho một user dựa trên userId truyền vào trong params
app.post('/posts/:userId', (req, res) => {
  const { userId } = req.params;
  const { content, isPublic } = req.body;
  
  const newPost = {
    userId,
    postId: uuidv4(),
    content,
    createdAt: new Date().toISOString(),
    isPublic
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// API để cập nhật thông tin bài post dựa trên postId truyền vào trong params
app.put('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  
  const index = posts.findIndex(post => post.postId === postId);
  if (index !== -1) {
    posts[index].content = content;
    res.json(posts[index]);
  } else {
    res.status(404).json({ msg: 'Bài post không tồn tại' });
  }
});

// API để xoá bài post dựa trên postId truyền vào trong params
app.delete('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  
  const index = posts.findIndex(post => post.postId === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    res.json({ msg: 'Xoá bài post thành công' });
  } else {
    res.status(404).json({ msg: 'Bài post không tồn tại' });
  }
});

// API để tìm kiếm các bài post với content tương ứng được gửi lên từ query params
app.get('/search', (req, res) => {
  const { content } = req.query;
  const filteredPosts = posts.filter(post => post.content.includes(content));
  res.json(filteredPosts);
});

// API để lấy tất cả các bài post với isPublic là true
app.get('/public-posts', (req, res) => {
  const publicPosts = posts.filter(post => post.isPublic);
  res.json(publicPosts);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
