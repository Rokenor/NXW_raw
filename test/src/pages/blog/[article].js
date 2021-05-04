import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  Breadcrumbs,
  Container,
  Link,
  Box,
  Typography,
} from '@material-ui/core';

export default function Blog({ post }) {
  // console.log('Article:', post);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>
          Blog | #{post.id} {post.title}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <main>
          <Box m={2}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/blog">
                Back to blog
              </Link>
              <Typography color="textPrimary">{post.title}</Typography>
            </Breadcrumbs>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Article #{post.id} {post.title}
          </Typography>
          <img src={post.image} alt={post.title} />
          {post.content.map((text, index) => {
            return (
              <Box pt={2} pb={2} key={`${text}${index}`}>
                <Typography variant="body1" gutterBottom>
                  {text}
                </Typography>
              </Box>
            );
          })}
          <Typography variant="body2" gutterBottom>
            Author: {post.author}
          </Typography>
          <Typography variant="body2" gutterBottom>
            From: {post.author_company}
          </Typography>
        </main>
      </Container>
    </>
  );
}

export async function getStaticProps({ params }) {
  // Call an external API endpoint to get post
  const res = await fetch(`http://localhost:8081/article/${params.article}`);
  const post = await res.json();
  const pageName = `Blog | Article ${post.id}`;

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      post,
      pageName,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:8081/articles');
  const posts = await res.json();
  const articles = [];
  for (const [key, value] of Object.entries(posts)) {
    articles.push(value);
  }

  // Get the paths we want to pre-render based on posts
  const paths = articles.map((article) => ({
    params: { article: article.id.toString() },
  }));

  return { paths, fallback: true };
}
