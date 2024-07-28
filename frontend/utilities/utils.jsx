
export function calculateStarsAndReviews(reviews, yachtId) {
    let totalStars = 0;
    let reviewCount = 0;
  
    Object.keys(reviews).forEach(reviewId => {
      const review = reviews[reviewId];
      if (Number(review.yachtId) === Number(yachtId)) {
        totalStars += review.stars;
        reviewCount++;
      }
    });
  
    const avgStarss = reviewCount > 0 ? totalStars / reviewCount : 0;
    const avgStars = (Math.round(avgStarss * 10) / 10).toFixed(1);
  
    return {
      avgStars: avgStars,
      reviewCount: reviewCount
    };
  }
  

  export function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${year}`;
  }


  export function loadScript (url) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${url}"]`)
      if (existingScript) {
        existingScript.addEventListener('load', resolve)
        existingScript.addEventListener('error', reject)
        return;
      }
  
      const script = document.createElement('script')
      script.src = url
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })

  }
