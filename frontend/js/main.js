// Star Rating Component (Visual Only - Non-functional)
document.addEventListener('DOMContentLoaded', function() {
    const starIcons = document.querySelectorAll('.star-icon');
    const ratingInput = document.getElementById('rating');
    
    // Visual feedback for star rating (non-functional)
    starIcons.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update visual display
            starIcons.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('bi-star');
                    s.classList.add('bi-star-fill');
                } else {
                    s.classList.remove('bi-star-fill');
                    s.classList.add('bi-star');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            starIcons.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('text-warning');
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            starIcons.forEach(s => {
                s.classList.remove('text-warning');
            });
        });
    });
    
    // Form Submission Handler
    const ratingForm = document.getElementById('ratingForm');
    
    if (ratingForm) {
        ratingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Validate that rating is selected
            const selectedRating = document.getElementById('rating').value;
            if (!selectedRating) {
                alert('Please select a rating before submitting.');
                return;
            }
            
            // Collect form data
            const formData = {
                courseName: document.getElementById('courseName').value,
                courseNumber: document.getElementById('courseNumber').value,
                major: document.getElementById('major').value,
                school: document.getElementById('school').value,
                dialoguesRequirement: document.getElementById('dialoguesRequirement').value,
                deliveryMode: document.querySelector('input[name="deliveryMode"]:checked')?.value,
                rating: selectedRating,
                review: document.getElementById('review').value,
                textbook: document.getElementById('textbook').value || null
            };
            
            // Log form data to console
            console.log('Form Data Submitted:', formData);
            
            // Show confirmation alert
            alert('Rating submitted successfully! (Check console for form data)');
            
            // Optional: Reset form after submission
            // ratingForm.reset();
        });
    }
});

