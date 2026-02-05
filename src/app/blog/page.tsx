import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Tag, Eye, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { AdBanner } from '@/components/ads/ad-banner';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: '10 PDF Tips Every Professional Should Know',
      excerpt: 'Discover essential PDF tips to boost your productivity and streamline document workflows.',
      slug: '10-pdf-tips-every-professional-should-know',
      author: 'Sarah Johnson',
      authorImage: 'https://i.pravatar.cc/150?img=1',
      date: 'June 15, 2024',
      readTime: '8 min read',
      category: 'Productivity',
      views: 1250,
      likes: 45,
      comments: 12,
      featured: true,
    },
    {
      id: 2,
      title: 'The Ultimate Guide to PDF Security',
      excerpt: 'Learn how to protect your sensitive documents with advanced PDF security techniques.',
      slug: 'ultimate-guide-to-pdf-security',
      author: 'Michael Chen',
      authorImage: 'https://i.pravatar.cc/150?img=2',
      date: 'June 10, 2024',
      readTime: '12 min read',
      category: 'Security',
      views: 980,
      likes: 32,
      comments: 8,
      featured: false,
    },
    {
      id: 3,
      title: 'How to Optimize PDFs for Web and Mobile',
      excerpt: 'Best practices for creating PDFs that work perfectly on all devices and screen sizes.',
      slug: 'optimize-pdfs-for-web-and-mobile',
      author: 'Emily Rodriguez',
      authorImage: 'https://i.pravatar.cc/150?img=3',
      date: 'June 5, 2024',
      readTime: '7 min read',
      category: 'Development',
      views: 750,
      likes: 28,
      comments: 5,
      featured: false,
    },
    {
      id: 4,
      title: 'PDF Accessibility: Making Documents Inclusive',
      excerpt: 'Learn how to create accessible PDFs that work for everyone, including people with disabilities.',
      slug: 'pdf-accessibility-making-documents-inclusive',
      author: 'David Wilson',
      authorImage: 'https://i.pravatar.cc/150?img=4',
      date: 'May 30, 2024',
      readTime: '10 min read',
      category: 'Accessibility',
      views: 620,
      likes: 24,
      comments: 3,
      featured: false,
    },
    {
      id: 5,
      title: 'The Future of PDF Technology',
      excerpt: 'Explore emerging trends and innovations in PDF technology and document management.',
      slug: 'future-of-pdf-technology',
      author: 'Jessica Lee',
      authorImage: 'https://i.pravatar.cc/150?img=5',
      date: 'May 25, 2024',
      readTime: '9 min read',
      category: 'Technology',
      views: 890,
      likes: 36,
      comments: 7,
      featured: false,
    },
    {
      id: 6,
      title: 'PDF vs Other Document Formats: A Comprehensive Comparison',
      excerpt: 'Understand the differences between PDF and other popular document formats like Word, HTML, and more.',
      slug: 'pdf-vs-other-document-formats',
      author: 'Robert Taylor',
      authorImage: 'https://i.pravatar.cc/150?img=6',
      date: 'May 20, 2024',
      readTime: '11 min read',
      category: 'Comparison',
      views: 540,
      likes: 21,
      comments: 4,
      featured: false,
    },
  ];

  const categories = [
    { name: 'Productivity', count: 8, slug: 'productivity' },
    { name: 'Security', count: 5, slug: 'security' },
    { name: 'Development', count: 7, slug: 'development' },
    { name: 'Accessibility', count: 3, slug: 'accessibility' },
    { name: 'Technology', count: 6, slug: 'technology' },
    { name: 'Comparison', count: 4, slug: 'comparison' },
  ];

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const otherPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              DittoPDF Blog
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Expert insights, tips, and tutorials on PDF technology, document management, and productivity.
            </p>
          </div>

          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 flex flex-col justify-center text-primary-foreground">
                  <Badge className="w-fit mb-4 bg-primary-foreground/20 text-primary-foreground">
                    Featured Article
                  </Badge>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="mb-6 text-primary-foreground/80">{featuredPost.excerpt}</p>
                  <Button variant="secondary" className="w-fit" asChild>
                    <Link href={`/blog/${featuredPost.slug}`}>Read Article</Link>
                  </Button>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={featuredPost.authorImage} alt={featuredPost.author} />
                      <AvatarFallback>
                        {featuredPost.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{featuredPost.author}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{featuredPost.date}</span>
                        <Clock className="h-3 w-3" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{featuredPost.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredPost.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{featuredPost.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{featuredPost.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.slice(0, 4).map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={post.authorImage} alt={post.author} />
                        <AvatarFallback>
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{post.author}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">All Articles</h2>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={post.authorImage} alt={post.author} />
                            <AvatarFallback>
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-medium">{post.author}</div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`}>Read More</Link>
                        </Button>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Our Newsletter</CardTitle>
              <CardDescription>Get the latest PDF tips, tutorials, and news delivered to your inbox</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-2">
                <Input type="email" placeholder="your@email.com" className="flex-1" />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AdBanner type="sidebar" />

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Button 
                    key={category.slug} 
                    variant="ghost" 
                    className="w-full justify-between" 
                    asChild
                  >
                    <Link href={`/blog/category/${category.slug}`}>
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  PDF
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Productivity
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Security
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Development
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Accessibility
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Technology
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Tutorials
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Tips
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=7" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">John Doe</span>
                      <span className="text-xs text-muted-foreground">on 10 PDF Tips</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Great article! The tip about using bookmarks changed my workflow completely.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Jane Smith</span>
                      <span className="text-xs text-muted-foreground">on PDF Security</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Very informative! I didn't know about some of these security features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog Archives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/blog/archives/2024">
                    <span>2024</span>
                    <Badge variant="secondary">12</Badge>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/blog/archives/2023">
                    <span>2023</span>
                    <Badge variant="secondary">8</Badge>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/blog/archives/2022">
                    <span>2022</span>
                    <Badge variant="secondary">5</Badge>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}