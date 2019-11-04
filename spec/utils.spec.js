const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
  formatPostedComment
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new empty array when passed an empty array', () => {
    const actual = formatDates([]);
    const expected = [];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
  it("returns an array containing 1 object with the value of 'created_at' converted to a JavaScript Date object when passed an array of 1 object", () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    const actual = formatDates(articles);
    expect(actual).to.eql(expected);
  });
  it("returns an array of article objects with the value of 'created_at' converted to a JavaScript Date object when passed an array of multiple articles", () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell.',
        created_at: 1416140514171
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ];
    const expected = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell.',
        created_at: new Date(1416140514171)
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1289996514171)
      }
    ];
    const actual = formatDates(articles);
    expect(actual).to.eql(expected);
  });

  it('does not mutate the input array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell.',
        created_at: 1416140514171
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ];
    formatDates(input);
    expect(input).to.eql([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell.',
        created_at: 1416140514171
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ]);
  });
});

describe('makeRefObj', () => {
  it('returns a new empty object when passed an empty array', () => {
    const actual = makeRefObj([]);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it('returns an object containing the title and article id as a key-value pair when passed an array containing 1 article object', () => {
    const actual = makeRefObj([{ article_id: 1, title: 'A' }]);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it('returns an object containing the title and article id as key-value pairs when passed an array containing multiple article objects', () => {
    const actual = makeRefObj([
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' }
    ]);
    const expected = { A: 1, B: 2, C: 3 };
    expect(actual).to.eql(expected);
  });
});

describe('formatComments', () => {
  it('returns a new empty array when passed an empty array and and a reference object', () => {
    const comments = [];
    const refObj = { A: 1, B: 2, C: 3 };
    const actual = formatComments(comments, refObj);
    const expected = [];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(comments);
  });
  it('returns a new array containing a new comments object with the `created_by` property renamed to an `author` key when passed an array containing 1 comment object', () => {
    const comments = [
      {
        created_by: 'icellusedkars'
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(comments, refObj);
    const expected = [
      {
        author: 'icellusedkars'
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(comments);
    expect(comments).to.eql([
      {
        created_by: 'icellusedkars'
      }
    ]);
  });
  it('returns a new array containing new comments objects with the `created_by` property renamed to an `author` key when passed an array containing multiple comments objects', () => {
    const comments = [
      {
        created_by: 'icellusedkars'
      },
      {
        created_by: 'butter_bridge'
      },
      {
        created_by: 'icellusedkars'
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(comments, refObj);
    const expected = [
      {
        author: 'icellusedkars'
      },
      {
        author: 'butter_bridge'
      },
      {
        author: 'icellusedkars'
      }
    ];
    expect(actual).to.eql(expected);
  });
  it('returns a new array containing new comments objects with the belongs_to` property renamed to an `article_id` key when passed an array containing multiple comments objects', () => {
    const comments = [
      {
        belongs_to: 'Living in the shadow of a great man'
      },
      {
        belongs_to: 'A'
      },
      {
        belongs_to: "They're not exactly dogs, are they?"
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(comments, refObj);
    expect(Object.keys(actual[0])).to.eql(['article_id']);
  });
  it('returns a new array containing new comments objects with the belongs_to` property changed to the `article_id` when passed an array containing multiple comments objects', () => {
    const comments = [
      {
        belongs_to: 'Living in the shadow of a great man'
      },
      {
        belongs_to: 'A'
      },
      {
        belongs_to: "They're not exactly dogs, are they?"
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(comments, refObj);
    const expected = [
      {
        article_id: 2
      },
      {
        article_id: 1
      },
      {
        article_id: 3
      }
    ];
    expect(actual).to.eql(expected);
  });
  it('handles being passed an empty reference object', () => {
    const comments = [
      {
        body: 'This is a bad article name',
        belongs_to: 'A',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1038314163389
      },
      {
        body: 'The owls are not what they seem.',
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'icellusedkars',
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: 'This morning, I showered for nine minutes.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 975242163389
      }
    ];
    const refObj = {};
    const actual = formatComments(comments, refObj);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("converts each comment's 'created_at' value into a JavaScript Date object", () => {
    const comments = [
      {
        body: 'This is a bad article name',
        belongs_to: 'A',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1038314163389
      },
      {
        body: 'The owls are not what they seem.',
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'icellusedkars',
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: 'This morning, I showered for nine minutes.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 975242163389
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    const actual = formatComments(comments, refObj);
    expect(actual[2].created_at).to.eql(new Date(975242163389));
  });
  it('does not mutate the passed array of comments objects', () => {
    const comments = [
      {
        body: 'This is a bad article name',
        belongs_to: 'A',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1038314163389
      },
      {
        body: 'The owls are not what they seem.',
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'icellusedkars',
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: 'This morning, I showered for nine minutes.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 975242163389
      }
    ];
    const refObj = {
      A: 1,
      'Living in the shadow of a great man': 2,
      "They're not exactly dogs, are they?": 3
    };
    formatComments(comments, refObj);
    expect(comments).to.eql([
      {
        body: 'This is a bad article name',
        belongs_to: 'A',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1038314163389
      },
      {
        body: 'The owls are not what they seem.',
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'icellusedkars',
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: 'This morning, I showered for nine minutes.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 975242163389
      }
    ]);
  });
});
describe('formatPostedComment', () => {
  it('returns a new empty object if passed an empty object', () => {
    const postedComment = {};
    const article_id = 3;
    const actual = formatPostedComment(postedComment, article_id);
    expect(actual).to.eql({});
    expect(actual).to.not.equal(postedComment);
  });
  it("returns a new comment object with the 'username' key changed to 'author' and the article_id added", () => {
    const postedComment = {
      username: 'icellusedkars',
      body: 'This is a really great article!'
    };
    const article_id = 3;
    const actual = formatPostedComment(postedComment, article_id);
    expect(actual).to.have.keys('author', 'body', 'article_id');
    expect(actual.article_id).to.equal(3);
  });
  it('does not mutate the input', () => {
    const postedComment = {
      username: 'icellusedkars',
      body: 'This is a really great article!'
    };
    const article_id = 3;
    formatPostedComment(postedComment, article_id);
    expect(postedComment).to.eql({
      username: 'icellusedkars',
      body: 'This is a really great article!'
    });
  });
});
