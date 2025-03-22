import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import blogService from '@/lib/blog-service';
import authService from '@/lib/auth-service';

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
        const postData = await blogService.getPost(Number(id));
        setPost(postData);
        const commentsData = await blogService.getComments(Number(id));
        setComments(commentsData);
      } catch (err) {
        setError('Failed to load blog post');
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      setError('Please login to comment');
      return;
    }

    setLoading(true);
    try {
      const comment = await blogService.createComment({
        post: Number(id),
        content: newComment
      });
      setComments([...comments, comment]);
      setNewComment('');
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