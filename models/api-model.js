exports.getApi = () => {
  console.log('In the api model');
  return {
    'GET /api': {
      description:
        'serves up a json representation of all the available endpoints of the api'
    },
    'GET /api/topics': {
      description: 'serves an array of all topics',
      queries: [],
      exampleResponse: {
        topics: [{ slug: 'football', description: 'Footie!' }]
      }
    },
    'GET /api/users/:username': {
      description:
        'serves an object containing the user information for the requested username',
      queries: [],
      exampleResponse: {
        user: {
          username: 'icellusedkars',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
          name: 'sam'
        }
      }
    },
    'GET /api/articles': {
      description: 'serves an array of all articles',
      queries: ['author', 'topic', 'sort_by', 'order'],
      exampleResponse: {
        articles: [
          {
            article_id: 33,
            title: 'Seafood substitutions are increasing',
            topic: 'cooking',
            author: 'weegembump',
            body: 'Text from the article..',
            created_at: 1527695953341,
            votes: 3,
            comment_count: 10
          }
        ]
      }
    },
    'GET /api/articles/:article_id': {
      description:
        'serves an object containing the article information for the requested article_id',
      queries: [],
      exampleResponse: {
        article: {
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          body: 'Well? Think about it.',
          votes: 0,
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '1986-11-23T12:21:54.171Z',
          comment_count: 2
        }
      }
    },
    'PATCH /api/articles/:article_id': {
      description:
        'updates the votes for the requested article_id by the value on the request body and responds with the updated article',
      exampleRequestBody1: { inc_votes: 5 },
      exampleResponse1: {
        article: {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          body: 'I find this existence challenging',
          votes: 105,
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '2018-11-15T12:21:54.171Z'
        }
      },
      exampleRequestBody2: { inc_votes: -20 },
      exampleResponse2: {
        article: {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          body: 'I find this existence challenging',
          votes: 85,
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '2018-11-15T12:21:54.171Z'
        }
      }
    },
    'POST /api/articles/:article_id/comments': {
      description:
        'adds the comment sent on the request body to the requested article_id and responds with the posted comment',
      exampleRequestBody: {
        username: 'icellusedkars',
        body: 'This is a really great article!'
      },
      exampleResponse: {
        comment: {
          comment_id: 19,
          author: 'icellusedkars',
          article_id: 3,
          votes: 0,
          created_at: '2019-10-13T15:28:51.724Z',
          body: 'This is a really great article!'
        }
      }
    },
    'GET /api/articles/:article_id/comments': {
      description:
        'serves an array of all comments for the requested article_id',
      queries: ['sort_by', 'order'],
      exampleResponse: {
        comments: [
          {
            comment_id: 19,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2019-10-13T15:28:51.724Z',
            body: 'This is a really great article!'
          }
        ]
      }
    },
    'PATCH /api/comments/:comment_id': {
      description:
        'updates the votes for the requested comment_id by the value on the request body and responds with the updated comment',
      exampleRequestBody: { inc_votes: 5 },
      exampleResponse: {
        comment: {
          comment_id: 1,
          author: 'butter_bridge',
          article_id: 9,
          votes: 21,
          created_at: '2017-11-22T12:36:03.389Z',
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        }
      }
    },
    'DELETE /api/comments/:comment_id': {
      description: 'deletes the comment with the requested comment_id'
    }
  };
};
