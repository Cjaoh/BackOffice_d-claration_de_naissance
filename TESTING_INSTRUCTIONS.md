# Testing Instructions for Backoffice Declaration Application

## Overview
This document provides step-by-step instructions to test the UserManagement and Settings components that were recently implemented.

## Prerequisites
1. Ensure you have Node.js and npm installed
2. Make sure you have a Firebase project set up with the correct configuration
3. Ensure all dependencies are installed by running `npm install`

## Testing the User Management Page

### 1. Accessing the Page
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:5173
3. Log in with valid credentials
4. Click on "Utilisateurs" in the sidebar navigation

### 2. Verifying User Display
- Check that the page loads without errors
- Verify that any existing users are displayed in the table
- Confirm that user information (name, email, role, status) is correctly shown
- Test the search functionality by entering text in the search box
- Test the role and status filters

### 3. Creating a New User
1. Click the "Ajouter un utilisateur" button
2. Fill in the user details:
   - Name
   - Email
   - Password
   - Role
   - Status
3. Click "Créer"
4. Verify that the new user appears in the table

### 4. Editing a User
1. Click the "Modifier" button next to a user
2. Change some user details
3. Click "Enregistrer"
4. Verify that the changes are reflected in the table

### 5. Deleting a User
1. Click the "Supprimer" button next to a user
2. Confirm the deletion in the confirmation dialog
3. Verify that the user is removed from the table

## Testing the Settings Page

### 1. Accessing the Page
1. Click on "Paramètres" in the sidebar navigation

### 2. Testing General Settings
1. Change the application name
2. Select a different language
3. Select a different timezone
4. Click "Enregistrer les modifications"
5. Verify that the success message appears
6. Refresh the page and confirm settings are persisted

### 3. Testing Notification Settings
1. Toggle the email notifications switch
2. Toggle the push notifications switch
3. Toggle the SMS notifications switch
4. Click "Enregistrer les modifications"
5. Refresh the page and confirm settings are persisted

### 4. Testing Security Settings
1. Toggle the two-factor authentication switch
2. Change the session timeout value
3. Click "Enregistrer les modifications"
4. Refresh the page and confirm settings are persisted

### 5. Testing Appearance Settings
1. Change the theme to "Sombre" (Dark)
2. Change the theme to "Clair" (Light)
3. Change the theme to "Système" (System)
4. Click "Enregistrer les modifications"
5. Verify that the theme changes are applied immediately
6. Refresh the page and confirm theme settings are persisted

## Common Issues and Solutions

### 1. Users Not Loading
- Check Firebase configuration in `src/firebase/firebaseConfig.ts`
- Verify that the Firebase project has the correct rules for reading users
- Check browser console for any error messages

### 2. Theme Not Applying
- Check that `index.html` includes the theme initialization script
- Verify that Tailwind CSS is properly configured with dark mode
- Check browser console for any JavaScript errors

### 3. Form Validation Issues
- Ensure all required fields are filled when creating/editing users
- Check that email format is valid
- Verify that password meets complexity requirements

### 4. Performance Issues
- If the user list is slow to load, consider implementing pagination
- For large datasets, add loading indicators

## Debugging Tools

### Browser Developer Tools
1. Open Developer Tools (F12)
2. Check the Console tab for any error messages
3. Check the Network tab to verify API calls are working
4. Use the Elements tab to inspect UI components

### Firebase Console
1. Navigate to your Firebase project console
2. Check the Authentication section for user management
3. Check the Firestore Database for data storage

## Additional Testing

### Cross-Browser Compatibility
- Test the application in Chrome, Firefox, and Edge
- Verify that all features work consistently across browsers

### Mobile Responsiveness
- Test the application on different screen sizes
- Verify that the layout adapts properly to mobile devices

### Accessibility
- Test keyboard navigation
- Verify that screen readers can interpret the content
- Check color contrast for accessibility compliance

## Reporting Issues

If you encounter any issues during testing:

1. Take a screenshot of the problem
2. Note the exact steps to reproduce the issue
3. Check the browser console for error messages
4. Include your browser version and operating system
5. Report the issue with this information

## Conclusion

This testing guide should help you verify that all components are working correctly. If you encounter any issues that you cannot resolve, please refer to the component documentation or seek additional support.