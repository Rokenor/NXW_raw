import Head from 'next/head';
import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import theme from '../theme';

const useStyles = makeStyles({
  root: {
    maxWidth: 700,
  },
  media: {
    height: 300,
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
});

export default function Home({ posts, defaultPhrase }) {
  // console.log('Posts', posts);
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState(defaultPhrase);
  const [articles, setArticles] = useState(posts.articles);

  const buttonHandler = (url) => {
    window.open(url, '_blank');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `https://free-news.p.rapidapi.com/v1/search?q=${searchValue}&lang=en`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            '2d153f6745msh961abb88d3f496fp1a4fa1jsn8da5b702d4da',
          'x-rapidapi-host': 'free-news.p.rapidapi.com',
        },
      }
    );
    const posts = await res.json();

    setArticles(posts.articles);
  };

  const inputHandler = (inputValue) => {
    setSearchValue(inputValue);
  };

  return (
    <>
      <Head>
        <title>Free News API Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h2" gutterBottom>
            Free News API Search
          </Typography>
          <form
            className={classes.form}
            noValidate
            autoComplete="off"
            onSubmit={submitHandler}
          >
            <TextField
              id="standard-basic"
              label="Type here your request"
              defaultValue={searchValue}
              onKeyUp={(e) => inputHandler(e.target.value)}
            />
          </form>
          {articles === undefined ? (
            <Container maxWidth="md">
              <Box mt={4}>Loading...</Box>
            </Container>
          ) : (
            <>
              {articles.map((article) => {
                return (
                  <Box mt={2} key={article._id}>
                    <Card className={classes.root}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={article.media}
                          title={article.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {article.summary}
                          </Typography>
                          <Box pt={2}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Author: {article.author}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Site: {article.clean_url}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => buttonHandler(article.link)}
                        >
                          Learn More
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const defaultPhrase = 'JavaScript';
  // https://rapidapi.com/newscatcher-api-newscatcher-api-default/api/free-news/endpoints
  const res = await fetch(
    `https://free-news.p.rapidapi.com/v1/search?q=${defaultPhrase}&lang=en`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '2d153f6745msh961abb88d3f496fp1a4fa1jsn8da5b702d4da',
        'x-rapidapi-host': 'free-news.p.rapidapi.com',
      },
    }
  );
  const posts = await res.json();
  const pageName = 'Free News API Example';

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
      pageName,
      defaultPhrase,
    },
  };
}
