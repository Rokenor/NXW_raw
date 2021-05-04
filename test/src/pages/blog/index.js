import Head from 'next/head';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 233,
    width: 350,
  },
});

export default function Blog({ articles }) {
  // console.log('Articles list:', articles);

  const router = useRouter();
  const classes = useStyles();

  const clickHandler = (url) => {
    router.push(url);
  };

  return (
    <>
      <Head>
        <title>NextJS Wokrshop | Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h2" gutterBottom>
            Articles
          </Typography>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {articles.map((article, index) => {
              const url = `/blog/${article.id}`;
              return (
                <Grid item xs key={article.id}>
                  <Card
                    className={classes.root}
                    onClick={() => clickHandler(url)}
                  >
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={article.image}
                        title={article.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Article #{article.id}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {article.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:8081/articles');
  const posts = await res.json();
  const articles = [];
  for (const [key, value] of Object.entries(posts)) {
    articles.push(value);
  }

  const pageName = 'Blog';

  // By returning { props: { articles } }, the Blog component
  // will receive `articles` as a prop at build time
  return {
    props: {
      articles,
      pageName,
    },
    revalidate: 60,
  };
}
