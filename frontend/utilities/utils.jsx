
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
  export function formatToLocalDateTime(isoString) {
    const date = new Date(isoString);
  
    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
  
    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Combine date and time components into the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  export function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${year}`;
  }
  export function formatDate2(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getDate()
    return `${day} ${month} ${year}`;
  }
  export function convertTo12HourFormat(time24) {
    const [hour, minute] = time24.split(':').map(Number);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
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
