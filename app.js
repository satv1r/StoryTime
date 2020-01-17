let prompt = document.getElementById('prompt');
let story = document.getElementById('story');
let credits = document.getElementById('credits');


class Reddit{
  constructor(){
    this.client_id = 'apNZkTIwL2THmw';
    this.client_secret = '	xzPbBJa6qhD4mL-6hBFJ9O1OuOU';
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

  cleanBody(text){
    return text.replace('[WP]', '').replace('[EU]', '').replace('[PI]', '').replace('[OT]', '');
  }

  async getPrompt(){
    const post = await fetch(`https://www.reddit.com/r/WritingPrompts/top.json?t=all&limit=100&after=1`)
                        .then(res => {
                          if(res.ok){
                            return res.json();
                          }
                          else{
                            throw new Error('Response failed.');
                          }
                        })
                        .then(res => res.data.children[this.getRandomIntInclusive(0, res.data.children.length)].data);
    return post;
  }

  async getStory(id){
    const stry = await fetch(`https://www.reddit.com/r/WritingPrompts/comments/${id}.json?sort=top`)
                        .then(res => {
                          if(res.ok){
                            return res.json();
                          }
                          else{
                            throw new Error('Response failed.');
                          }
                        })
                        .then(res => res[1].data.children[this.getRandomIntInclusive(1, 10)].data);
    return stry;
  }
};

const reddit = new Reddit;
let pAuthor, sAuthor = '';
reddit.getPrompt()
      .then(res => {
        let title = reddit.cleanBody(res.title);
        pAuthor = res.author;
        prompt.innerHTML = title;
        return res.id;
      })
      .then(id => reddit.getStory(id))
      .then(comment => {
        sAuthor = comment.author;
        story.innerHTML = comment.body;
        credits.innerHTML = `Prompt by: ${pAuthor}, Story by: ${sAuthor}`
      });



