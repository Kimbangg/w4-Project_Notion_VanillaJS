import { getItem, setItem } from "../Storage.js";
import { request } from "../api.js";
import Editor from "./Editor.js";

// PageEdit 페이지의 역할은 무엇일까?
// 상황에 맞는 Editor를 출력하고, 데이터를 불러와서 보여주는 역할을 수행?
export default function PostEditPage({ $target, initialState }) {
  const $page = document.createElement("div");

  this.state = initialState;

  let postLocalSaveKey = `temp-post-${this.state.postId}`;

  const post = getItem(postLocalSaveKey, {
    title: "",
    content: "",
  });

  let timer = null;

  const editor = new Editor({
    $target: $page,
    initialState: post,
    onEditing: async (post) => {
      // debounce
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setItem(postLocalSaveKey, {
          ...post,
          tempSaveDate: new Date(),
        });
      }, 1000);

      // await request(`/documents/${post.id}`, {
      //   method: "POST",
      //   body: JSON.stringify(post),
      // });
    },
  });

  this.setState = async (nextState) => {
    if (this.state.postId !== nextState.postId) {
      this.state = nextState;
      postLocalSaveKey = `temp-post-${this.state.postId}`;
      await fetchPost();
      return;
    }

    this.state = nextState;
    this.render();
    editor.setState(this.state.post);
  };

  this.render = () => {
    $target.appendChild($page);
  };

  const fetchPost = async () => {
    const { postId } = this.state;

    if (postId !== "new") {
      const post = await request(`/posts/${postId}`);

      this.setState({
        ...this.state,
        post,
      });
    }
  };
}
