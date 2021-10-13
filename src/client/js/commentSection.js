const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteButtons = document.getElementsByClassName("commentDelete");

const deleteComment = async (event) => {
  const parent = event.target.parentNode;
  const videoId = videoContainer.dataset.videoid;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commentId: parent.dataset.id,
      isNew: parent.classList.contains("newone"),
    }),
  });
  if (response.status !== 403) parent.remove();
};

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment newone";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = " " + text;
  const span2 = document.createElement("span");
  span2.innerText = " ❌";
  span2.addEventListener("click", deleteComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
  if (text === "") {
    alert("Please write something to comment area");
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    addComment(text);
  }
  textarea.value = "";
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", deleteComment);
}
