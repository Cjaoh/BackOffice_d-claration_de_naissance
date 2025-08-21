# Component Architecture

## Settings Page Structure

```mermaid
graph TD
    A[Settings Page] --> B[General Settings Card]
    A --> C[Notification Settings Card]
    A --> D[Security Settings Card]
    A --> E[Appearance Settings Card]
    
    B --> B1[AppName Input]
    B --> B2[Language Selector]
    B --> B3[Timezone Selector]
    
    C --> C1[Email Notifications Toggle]
    C --> C2[Push Notifications Toggle]
    C --> C3[SMS Notifications Toggle]
    
    D --> D1[Two-Factor Auth Toggle]
    D --> D2[Session Timeout Selector]
    
    E --> E1[Theme Selector]
    E --> E2[Font Size Selector]
    
    A --> F[Save Button]
```

## User Management Page Structure

```mermaid
graph TD
    A[User Management Page] --> B[User Search & Filters]
    A --> C[User Table]
    A --> D[Add User Button]
    
    B --> B1[Search Input]
    B --> B2[Role Filter]
    B --> B3[Status Filter]
    
    C --> C1[User Row 1]
    C --> C2[User Row 2]
    C --> C3[User Row N]
    
    C1 --> C1A[User Name]
    C1 --> C1B[User Email]
    C1 --> C1C[User Role]
    C1 --> C1D[User Status]
    C1 --> C1E[Action Buttons]
    
    C1E --> C1E1[Edit Button]
    C1E --> C1E2[Delete Button]
    
    A --> E[User Edit Modal]
    A --> F[User Create Modal]
    A --> G[Delete Confirmation Dialog]
    
    E --> E1[Edit Form]
    F --> F1[Create Form]
```

## File Structure

```
src/
├── components/
│   ├── settings/
│   │   └── Settings.tsx
│   ├── users/
│   │   └── UserManagement.tsx
│   └── ... (existing components)
├── services/
│   ├── userService.ts
│   └── declarationService.ts
└── ... (other directories)
```

## Data Flow

### Settings Page Data Flow

```mermaid
graph LR
    A[Settings Component] --> B[Load Settings from Firestore]
    B --> C[Display in Form]
    C --> D[User Edits Settings]
    D --> E[Save to Firestore]
    E --> F[Update UI with Success Message]
```

### User Management Data Flow

```mermaid
graph LR
    A[UserManagement Component] --> B[Load Users from Firestore]
    B --> C[Display in Table]
    C --> D1[User Searches/Sorts]
    C --> D2[User Edits Record]
    C --> D3[User Creates Record]
    C --> D4[User Deletes Record]
    
    D1 --> E1[Filter/Sort Data]
    D2 --> E2[Update User in Firestore]
    D3 --> E3[Create User in Firestore/Auth]
    D4 --> E4[Delete User from Firestore/Auth]
    
    E1 --> F1[Update Table]
    E2 --> F2[Update Table Row]
    E3 --> F3[Add New Row to Table]
    E4 --> F4[Remove Row from Table]