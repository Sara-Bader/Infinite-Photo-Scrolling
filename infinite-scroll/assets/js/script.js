document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('image-container');
    const loader = document.getElementById('loader');
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const downloadLink = document.getElementById("downloadLink");
    const closeBtn = document.getElementsByClassName("close")[0]; 
    let ready = false;
    let imagesLoaded = 0;
    let totalImages = 0;
    let photosArray = [];
    let currentPage = 1;
    const count = 30;

    
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.style.display = "none"; 
    }
}


 
    function setAttributes(element, attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }

    function openModal(photo) {
        modal.style.display = "block";
        modalImg.src = `https://picsum.photos/id/${photo.id}/1080/1080`;
        captionText.innerHTML = `Photo by ${photo.author}`;
        downloadLink.href = `https://picsum.photos/id/${photo.id}/1080/1080`;
        downloadLink.download = `Photo_by_${photo.author}.jpg`;
        downloadLink.onclick = function() {
           
            console.log('Download button clicked for:', downloadLink.download);
        };
    }

   
    function displayPhotos() {
        imagesLoaded = 0;
        totalImages = photosArray.length;
       
        photosArray.forEach((photo) => {
            const item = document.createElement('a');
            setAttributes(item, {
                href: `https://picsum.photos/id/${photo.id}/1080/1080`,
                target: '_blank',
                download: `Photo_by_${photo.author}.jpg`
            });

            // Create <img> for photo
            const img = document.createElement('img');
            setAttributes(img, {
                src: `https://picsum.photos/id/${photo.id}/300/300`,
                alt: photo.author,
                title: `Photo by ${photo.author}`
            });

            img.addEventListener('load', imageLoaded);

            img.onclick = function(event) {
                event.preventDefault();
                openModal(photo);
            };

            item.appendChild(img);
            imageContainer.appendChild(item);
        });
    }

   
    async function getPhotos() {
        ready = false;
        loader.hidden = false; // Show the loader before fetching photos
        const apiUrl = `https://picsum.photos/v2/list?page=${currentPage}&limit=${count}`;
        try {
            const response = await fetch(apiUrl);
            photosArray = await response.json();
            displayPhotos();
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    }

  
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
            ready = false;
            currentPage++;
            getPhotos();
        }
    });

   
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    getPhotos();
});
