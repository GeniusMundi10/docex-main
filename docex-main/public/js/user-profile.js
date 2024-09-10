document.addEventListener('DOMContentLoaded', function() {
    const userProfileBtn = document.getElementById('userProfileBtn');

    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    showUserDetails(user);
                } else {
                    console.log('No user is signed in.');
                }
            });
        });
    }
});

function showUserDetails(user) {
    // Create a modal to display user details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full';
    modal.id = 'userDetailsModal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                <div class="mt-2 px-7 py-3">
                    <p class="text-sm text-gray-500">
                        <strong>Name:</strong> ${user.displayName || 'N/A'}<br>
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>User ID:</strong> ${user.uid}
                    </p>
                </div>
                <div class="items-center px-4 py-3">
                    <button id="closeModal" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeModal').onclick = function() {
        document.body.removeChild(modal);
    };
}
