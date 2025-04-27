// Mostrar u ocultar aviso de login
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    document.getElementById("login-warning").style.display = isLoggedIn ? "none" : "block";

    // Cargar perfil
    loadProfile();

    // Cargar posts
    loadPosts();
});

// Cambiar foto de perfil
function changeProfilePic() {
    document.getElementById("profile-input").click();
}

document.getElementById("profile-input").addEventListener("change", (e) => {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = document.getElementById("profile-img");
        img.src = event.target.result;
        localStorage.setItem("profileImg", event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Guardar cambios en perfil
["profile-name", "profile-occupation", "profile-location"].forEach(id => {
    document.getElementById(id).addEventListener("blur", (e) => {
        localStorage.setItem(id, e.target.innerText);
    });
});

function loadProfile() {
    document.getElementById("profile-img").src = localStorage.getItem("profileImg") || "/android-chrome-51x512.png";
    document.getElementById("profile-name").innerText = localStorage.getItem("profile-name") || "Mi perfil";
    document.getElementById("profile-occupation").innerText = localStorage.getItem("profile-occupation") || "Diseñador, UI";
    document.getElementById("profile-location").innerText = localStorage.getItem("profile-location") || "Londres, Reino Unido";
}

// Crear post
document.getElementById("post-submit").addEventListener("click", () => {
    const text = document.getElementById("post-text").value.trim();
    const media = document.getElementById("post-media").files[0];

    if (!text && !media) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const post = {
            text,
            media: media ? event.target.result : null,
            type: media ? media.type.split('/')[0] : null,
            likes: 0,
            comments: []
        };
        savePost(post);
        renderPost(post);
        document.getElementById("post-text").value = "";
        document.getElementById("post-media").value = "";
    };

    if (media) {
        reader.readAsDataURL(media);
    } else {
        reader.onload({ target: { result: null } });
    }
});

function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(renderPost);
}

function renderPost(post) {
    const postsList = document.getElementById("posts-list");

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
                                                                                                                                                        <div class="post-header">
                                                                                                                                                              <img src="${localStorage.getItem("profileImg") || "/android-chrome-51x512.png"}" class="user-img">
                                                                                                                                                                    <h5>${localStorage.getItem("profile-name") || "Mi perfil"}</h5>
                                                                                                                                                                        </div>
                                                                                                                                                                            <p>${post.text}</p>
                                                                                                                                                                                ${post.media ? (post.type === "video"
            ? `<video controls class="post-img"><source src="${post.media}" type="video/mp4"></video>`
            : `<img src="${post.media}" class="post-img" alt="media">`) : ''}
                                                                                                                                                                                                <div class="post-actions">
                                                                                                                                                                                                      <button class="like-btn">👍 Me gusta</button>
                                                                                                                                                                                                            <button class="comment-btn">💬 Comentario</button>
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                    <div class="comment-section">
                                                                                                                                                                                                                          <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                                                                                                                                                                                                                                <button class="submit-comment">Enviar</button>
                                                                                                                                                                                                                                      <div class="comments"></div>
                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                            `;

    postsList.prepend(div);

    // Like
    div.querySelector(".like-btn").addEventListener("click", (e) => {
        e.target.style.backgroundColor = "blue";
        e.target.textContent = "✔ Me gusta";
    });

    // Mostrar comentarios
    div.querySelector(".comment-btn").addEventListener("click", () => {
        const commentSection = div.querySelector(".comment-section");
        commentSection.style.display = commentSection.style.display === "block" ? "none" : "block";
    });

    // Enviar comentario
    div.querySelector(".submit-comment").addEventListener("click", () => {
        const input = div.querySelector(".comment-input");
        const comment = input.value.trim();
        if (comment) {
            const p = document.createElement("p");
            p.textContent = comment;
            div.querySelector(".comments").appendChild(p);
            input.value = "";
        }
    });
