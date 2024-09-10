// Initialize Firebase (if not already done)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get references to the auth service
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function () {
    // Sign-in user
    const signinForm = document.getElementById("signinForm");
    if (signinForm) {
        signinForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    var user = userCredential.user;
                    // Optionally redirect or update UI
                    window.location.href = 'index.html'; // or update UI without redirecting
                })
                .catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error(errorMessage);
                });
        });
    }
    const forgotPasswordLink = document.getElementById("forgotPassword");
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert("Password reset email sent. Please check your inbox.");
                    })
                    .catch((error) => {
                        console.error('Password reset error:', error);
                        alert('Error: ' + error.message);
                    });
            } else {
                alert("Please enter your email address in the email field.");
            }
        });
    }
    // Register user
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            console.log(`Attempting to register user with email: ${email}`);
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Registration successful
                    console.log('User registered:', userCredential.user);
                    console.log(`Newly registered user UID: ${userCredential.user.uid}`);
                    
                    // Set the user's display name to their email (or you can ask for their name during registration)
                    return userCredential.user.updateProfile({
                        displayName: email.split('@')[0] // Use the part before @ as the display name
                    });
                })
                .then(() => {
                    // Sign out the user immediately after registration
                    return auth.signOut();
                })
                .then(() => {
                    console.log('User signed out after registration.');
                    // Redirect to the registration success page
                    window.location.href = "registration-success.html";
                })
                .catch((error) => {
                    console.error('Registration error:', error);
                    alert('Error: ' + error.message);
                });
        });
    }

    // Check if a user is signed in and update UI elements
    auth.onAuthStateChanged((user) => {
        const signInBtn = document.getElementById('signInBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        const getDemoBtn = document.getElementById('try-docex-btn');
        const userProfileSection = document.getElementById('userProfileSection');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (user) {
            console.log('User is signed in:', user);
            signInBtn.style.display = 'none'; // Hide Sign In button
            signOutBtn.style.display = 'inline-block'; // Show Sign Out button
            getDemoBtn.href = "https://invoiceextraction.streamlit.app/"; // Change Get Demo link to the tool page
            if (userProfileSection) {
                userProfileSection.classList.remove('hidden');
            }
            if (userNameDisplay) {
                userNameDisplay.textContent = `Welcome, ${user.displayName || user.email}`;
                userNameDisplay.classList.remove('hidden');
            }
        } else {
            console.log('No user is signed in.');
            signInBtn.style.display = 'inline-block'; // Show Sign In button
            signOutBtn.style.display = 'none'; // Hide Sign Out button
            getDemoBtn.href = "register.html"; // Change Get Demo link to the registration page
            if (userProfileSection) {
                userProfileSection.classList.add('hidden');
            }
            if (userNameDisplay) {
                userNameDisplay.textContent = '';
                userNameDisplay.classList.add('hidden');
            }
        }
    });

    // Sign out user
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            auth.signOut().then(() => {
                console.log('User signed out.');
                window.location.href = "index.html"; // Redirect to the main page after signing out
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        });
    }

    // Optional: Require authentication for certain actions/pages
    function requireAuth() {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "sign-in.html"; // Redirect to sign-in page if not authenticated
            } else {
                // If authenticated, proceed with the action
                window.location.href = "https://invoiceextraction.streamlit.app/"; // Or any other action you want to trigger
            }
        });
    }

    // Attach requireAuth to specific actions, e.g., a button click
    const tryDocExBtn = document.getElementById('try-docex-btn');
    if (tryDocExBtn) {
        tryDocExBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action (following the link)
            requireAuth();
        });
    }
});
