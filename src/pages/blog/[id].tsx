import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import blogService from '@/lib/blog-service';
import { authService } from '@/lib/auth-service';

interface Post {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

const BlogPostPage = () => {
  const { id } = useParams();
  const { currentLang, isRTL } = useLanguage();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await blogService.getPostById(id, token || '');
        // Convert IPost to Post
        const convertedPost = {
          ...fetchedPost,
          id: fetchedPost.id.toString()
        };
        setPost(convertedPost);
        setPostId(fetchedPost.id.toString());
        // Convert IComment[] to Comment[]
        const convertedComments = fetchedPost.comments?.map(comment => ({
          ...comment,
          name: comment.author?.name || '',
          email: '',
          is_approved: comment.status === 'approved'
        })) || [];
        setComments(convertedComments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const [postId, setPostId] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(authService.getToken());
  }, []);

  const addComment = async (commentData: any) => {
    try {
      const newComment = await blogService.addComment(postId, commentData, token || '');
      // Convert IComment to Comment
      const convertedComment: Comment = {
        ...newComment,
        name: newComment.author?.name || '',
        email: '',
        is_approved: newComment.status === 'approved'
      };
      setComments(prevComments => [...prevComments, convertedComment]);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      setError('Please login to comment');
      return;
    }

    setLoading(true);
    try {
      const success = await addComment({
        content: newComment
      });
      if (success) {
        setNewComment('');
      } else {
        setError('Failed to post comment');
      }
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar initialLang={currentLang} />
        <main className="pt-20 container mx-auto px-4">
          <p className="text-center text-gray-400">
            {error || 'Loading...'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20 container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              {post.content}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button type="submit" disabled={loading || !newComment.trim()}>
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="py-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;