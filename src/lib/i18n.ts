export type Language = 'en' | 'ar' | 'sv';

export const translations = {
  en: {
    // Landing Page
    appName: 'Amanah',
    tagline: 'Support your family, together',
    taglineSubtext: 'Amanah means "trust" - the foundation of family support',
    getStarted: 'Get Started',
    createGroups: 'Create Groups',
    createGroupsDesc: 'Build private family circles to pool resources and support each other',
    saveTogether: 'Save Together',
    saveTogetherDesc: 'Contribute regularly or one-time to help families in need',
    voteSupport: 'Vote & Support',
    voteSupportDesc: 'Decide together which family members need help most',
    
    // Dashboard
    welcome: 'Welcome',
    logout: 'Logout',
    myGroups: 'My Groups',
    activeCampaigns: 'Active Campaigns',
    totalContributed: 'Total Contributed',
    familiesHelped: 'Families Helped',
    completedCampaigns: 'Completed campaigns',
    newCampaign: '+ New Campaign',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    startCampaign: 'Start Campaign',
    contribute: 'Contribute',
    createGroup: 'Create Group',
    create: '+ Create',
    
    // Campaign
    raised: 'raised',
    goal: 'Goal',
    contributors: 'contributors',
    completed: 'Completed',
    active: 'Active',
    pending: 'Pending Approval',
    needsVotes: 'Needs {count} more votes to become active',
    pendingCampaigns: 'Pending Campaigns',
    
    // Forms
    campaignTitle: 'Campaign Title',
    beneficiaryName: 'Beneficiary Name',
    description: 'Description',
    targetAmount: 'Target Amount',
    currency: 'Currency',
    familyGroup: 'Family Group',
    selectGroup: 'Select a group',
    cancel: 'Cancel',
    createCampaignBtn: 'Create Campaign',
    creating: 'Creating...',
    
    // Group
    groupName: 'Group Name',
    inviteMembers: 'Invite Members',
    inviteByEmail: 'Invite by Email',
    inviteByPhone: 'Invite by Phone Number',
    onePerLine: 'One per line',
    members: 'members',
    
    // Contribute
    makeContribution: 'Make a Contribution',
    selectCampaign: 'Select Campaign',
    contributionAmount: 'Contribution Amount',
    recurringContribution: 'Make this a recurring contribution',
    frequency: 'Frequency',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    confirmContribution: 'Confirm Contribution',
    processing: 'Processing...',
    
    // Navigation
    backToDashboard: 'Back to Dashboard',
    
    // Campaign Creation
    createNewCampaign: 'Create New Campaign',
    createNewCampaignDesc: 'Start a fundraising campaign to help a family member in need',
    whoWillReceive: 'Who will receive the funds?',
    explainCampaign: 'Explain why this campaign is needed and how the funds will be used',
    
    // Group Creation
    createFamilyGroup: 'Create Family Group',
    bringFamilyTogether: 'Bring your family together to support each other',
    whatIsGroupFor: 'What is this group for? (optional)',
    enterEmailAddresses: 'Enter email addresses, one per line',
    enterContactInfo: 'Enter email addresses or phone numbers, one per line',
    inviteLater: 'You can invite more members later',
    groupPrivacy: 'Group Privacy',
    groupPrivacyDesc: 'Only invited members can see campaigns and contributions within this group. All members can create campaigns and vote on priorities.',
    
    // Contribution
    supportFamilyMember: 'Support a family member in need',
    chooseCampaign: 'Choose a campaign',
    campaignDetails: 'Campaign Details',
    quickAmounts: 'Quick amounts',
    makeRecurring: 'Make this a recurring contribution',
    makePrivate: 'Make this contribution private (anonymous)',
    nameWillBeHidden: 'Your name will be hidden from other group members. Only "Anonymous" will be shown.',
    canCancelAnytime: 'You can cancel recurring contributions anytime',
    privacyPayment: 'Privacy & Payment',
    manualTracking: 'Currently, contributions are tracked manually. Payment integration will be added to support multiple regions and payment methods.',
    privateContribDesc: 'Private contributions will show as "Anonymous" to protect your privacy while still counting toward the campaign goal.',
    
    // Campaign
    dueDate: 'Due Date',
    dueDateOptional: 'Optional - Set a deadline for this campaign',
    daysLeft: 'days left',
    overdue: 'Overdue',
    vote: 'Vote',
    voted: 'Voted',
    votes: 'votes',
    voteForCampaign: 'Vote for this campaign',
    removeVote: 'Remove your vote',
    votingHelp: 'Vote to show support and help prioritize this campaign',
    
    // Auth
    login: 'Login',
    createAccount: 'Create Account',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loggingIn: 'Logging in...',
    creatingAccount: 'Creating account...',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUp: 'Sign up',
    backToHome: '← Back to home',
    invalidCredentials: 'Invalid email or password',
    emailAlreadyRegistered: 'Email already registered',
    passwordsDontMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    
    // Landing page
    seeFamiliesSupporting: 'See how families are supporting each other',
    loginToContribute: 'Login to contribute →',
    viewAllCampaigns: 'View all campaigns →',
    
    // Activity feed
    contributed: 'contributed',
    to: 'to',
    createdCampaign: 'created campaign',
    createdGroup: 'created group',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    private: 'Private',
    anonymous: 'Anonymous',
    
    // Group Detail Page - Additional keys
    groupSettings: 'Group Settings',
    campaignsInGroup: 'Campaigns in this Group',
    noCampaignsYet: 'No campaigns yet',
    createFirstCampaign: 'Create First Campaign',
    totalCampaigns: 'Total Campaigns',
    inviteMembersTitle: 'Invite Members',
    inviteMembersByEmail: 'Invite members by email or phone number',
    emailAddresses: 'Email Addresses',
    phoneNumbers: 'Phone Numbers',
    onePerLineWithCountry: 'One per line, include country code',
    sendInvites: 'Send Invites',
    inviting: 'Inviting...',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
    dangerZone: 'Danger Zone',
    deleteGroup: 'Delete Group',
    deleteGroupWarning: 'This will permanently delete the group and all its campaigns. This action cannot be undone.',
    invited: 'Invited',
    admin: 'Admin',
    removeMember: 'Remove member',
    inviteMoreMembers: 'Invite More Members',
    
    // Alert Messages
    pleaseEnterEmail: 'Please enter at least one email or phone number',
    membersInvitedSuccess: 'member(s) invited successfully!',
    failedToInviteMembers: 'Failed to invite members',
    memberRemovedSuccess: 'Member removed successfully',
    cannotRemoveAdmin: 'Failed to remove member. You cannot remove the group admin.',
    groupSettingsUpdated: 'Group settings updated successfully!',
    failedToUpdateGroup: 'Failed to update group settings',
    campaignDeletedSuccess: 'Campaign deleted successfully',
    failedToDeleteCampaign: 'Failed to delete campaign',
    groupDeletedSuccess: 'Group deleted successfully',
    failedToDeleteGroup: 'Failed to delete group',
    contributionSuccess: 'Contribution submitted successfully!',
    campaignCreatedSuccess: 'Campaign created successfully!',
    groupCreatedSuccess: 'Family group created successfully!',
    pleaseLoginToVote: 'Please login to vote',
    
    // Confirmation Messages
    confirmRemoveMember: 'Are you sure you want to remove {name} from this group?',
    confirmDeleteCampaign: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
    confirmDeleteGroup: 'Are you sure you want to delete "{name}"? This will also delete all campaigns in this group. This action cannot be undone.',
    
    // Campaign Pending Messages
    campaignPendingApproval: 'Campaign Pending Approval',
    needsMoreVotes: 'This campaign needs {count} more {votes} to become active and start accepting contributions.',
    needsMoreVotesShort: 'Needs {count} more {votes} to become active',
    vote_singular: 'vote',
    vote_plural: 'votes',
    needsVotesBeforeContrib: 'This campaign needs {count} more {votes} before it can accept contributions.',
    voteToActivate: 'Vote above to help activate this campaign.',
    pendingCampaignsDesc: 'These campaigns need 3 votes to become active',
    
    // Loading
    loading: 'Loading...',
    
    // Invite System
    inviteCode: 'Invite Code',
    inviteCodeRequired: 'Invite code is required',
    enterInviteCode: 'Enter your invite code',
    inviteCodeInvalid: 'Invalid or expired invite code',
    inviteOnly: 'Invite Only',
    inviteOnlyDesc: 'This is a private family platform. You need an invite code to register.',
    noInviteCode: "Don't have an invite code?",
    contactAdmin: 'Contact your family admin to get an invite.',
    
    // Profile Settings
    profile: 'Profile',
    editProfile: 'Edit Profile',
    profileSettings: 'Profile Settings',
    personalInfo: 'Personal Information',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updateProfile: 'Update Profile',
    updating: 'Updating...',
    profileUpdated: 'Profile updated successfully!',
    passwordUpdated: 'Password updated successfully!',
    profilePicture: 'Profile Picture',
    uploadPhoto: 'Upload Photo',
    removePhoto: 'Remove Photo',
    changePhoto: 'Change Photo',
    phoneNumber: 'Phone Number',
    bio: 'Bio',
    aboutYou: 'Tell us about yourself',
    currentPasswordWrong: 'Current password is incorrect',
    passwordsNotMatch: 'New passwords do not match',
    passwordTooShortNew: 'New password must be at least 6 characters',
    
    // Invite Management
    manageInvites: 'Manage Invites',
    createInvite: 'Create Invite',
    inviteCodes: 'Invite Codes',
    shareInviteCodes: 'Share invite codes with family members to allow them to register. Each code can only be used once.',
    code: 'Code',
    status: 'Status',
    usedBy: 'Used By',
    created: 'Created',
    actions: 'Actions',
    copyInviteLink: 'Copy invite link',
    deactivate: 'Deactivate',
    deactivated: 'Deactivated',
    createInviteCode: 'Create Invite Code',
    maxUses: 'Maximum Uses',
    maxUsesDesc: 'How many times this code can be used (leave 1 for single use)',
    expiresIn: 'Expires In',
    expiresInDesc: 'How many days until this code expires',
    days: 'days',
    confirmDeactivate: 'Are you sure you want to deactivate invite code: {code}?',
    inviteCreatedSuccess: 'Invite code created successfully!',
    inviteCopied: 'Invite link copied to clipboard!',
    
    // Empty States
    noActiveCampaigns: 'No active campaigns yet',
    createFirstCampaignBtn: 'Create your first campaign',
    
    // User Management
    activeInvites: 'Active invites',
    adminUnlimitedInvites: 'Admin - Unlimited invites',
    inviteLimitReached: 'You have reached your invite limit (5 active invites). Deactivate or wait for existing invites to be used.',
    userManagement: 'User Management',
    allUsers: 'All Users',
    makeAdmin: 'Make Admin',
    removeAdmin: 'Remove Admin',
    member: 'Member',
    confirmMakeAdmin: 'Are you sure you want to make {name} an admin? They will have full access to manage users and invites.',
    confirmRemoveAdmin: 'Are you sure you want to remove admin rights from {name}?',
    userRoleUpdated: 'User role updated successfully!',
    onlyAdminsCanManage: 'Only admins can manage user roles',
    
    // Group-specific invites
    optional: 'Optional',
    generalInvite: 'General invite (no group)',
    groupInviteDesc: 'If you select a group, new users will automatically be added to that group',
    forGroup: 'For group',
  },
  ar: {
    // Landing Page
    appName: 'أمانة',
    tagline: 'ادعم عائلتك، معاً',
    taglineSubtext: 'أمانة تعني "الثقة" - أساس الدعم العائلي',
    getStarted: 'ابدأ الآن',
    createGroups: 'إنشاء مجموعات',
    createGroupsDesc: 'بناء دوائر عائلية خاصة لتجميع الموارد ودعم بعضكم البعض',
    saveTogether: 'الادخار معاً',
    saveTogetherDesc: 'المساهمة بشكل منتظم أو لمرة واحدة لمساعدة العائلات المحتاجة',
    voteSupport: 'التصويت والدعم',
    voteSupportDesc: 'قرروا معاً أي أفراد العائلة يحتاجون المساعدة أكثر',
    
    // Dashboard
    welcome: 'مرحباً',
    logout: 'تسجيل الخروج',
    myGroups: 'مجموعاتي',
    activeCampaigns: 'الحملات النشطة',
    totalContributed: 'إجمالي المساهمات',
    familiesHelped: 'العائلات المساعدة',
    completedCampaigns: 'الحملات المكتملة',
    newCampaign: '+ حملة جديدة',
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    startCampaign: 'بدء حملة',
    contribute: 'المساهمة',
    createGroup: 'إنشاء مجموعة',
    create: '+ إنشاء',
    
    // Campaign
    raised: 'تم جمعه',
    goal: 'الهدف',
    contributors: 'المساهمون',
    completed: 'مكتملة',
    active: 'نشطة',
    pending: 'في انتظار الموافقة',
    needsVotes: 'يحتاج {count} أصوات أخرى ليصبح نشطاً',
    pendingCampaigns: 'الحملات المعلقة',
    
    // Forms
    campaignTitle: 'عنوان الحملة',
    beneficiaryName: 'اسم المستفيد',
    description: 'الوصف',
    targetAmount: 'المبلغ المستهدف',
    currency: 'العملة',
    familyGroup: 'المجموعة العائلية',
    selectGroup: 'اختر مجموعة',
    cancel: 'إلغاء',
    createCampaignBtn: 'إنشاء حملة',
    creating: 'جاري الإنشاء...',
    
    // Group
    groupName: 'اسم المجموعة',
    inviteMembers: 'دعوة الأعضاء',
    inviteByEmail: 'دعوة عبر البريد الإلكتروني',
    inviteByPhone: 'دعوة عبر رقم الهاتف',
    onePerLine: 'واحد في كل سطر',
    members: 'أعضاء',
    
    // Contribute
    makeContribution: 'تقديم مساهمة',
    selectCampaign: 'اختر حملة',
    contributionAmount: 'مبلغ المساهمة',
    recurringContribution: 'اجعل هذه مساهمة متكررة',
    frequency: 'التكرار',
    weekly: 'أسبوعياً',
    monthly: 'شهرياً',
    quarterly: 'ربع سنوي',
    confirmContribution: 'تأكيد المساهمة',
    processing: 'جاري المعالجة...',
    
    // Navigation
    backToDashboard: 'العودة إلى لوحة التحكم',
    
    // Campaign Creation
    createNewCampaign: 'إنشاء حملة جديدة',
    createNewCampaignDesc: 'ابدأ حملة لجمع التبرعات لمساعدة أحد أفراد العائلة المحتاجين',
    whoWillReceive: 'من سيحصل على الأموال؟',
    explainCampaign: 'اشرح سبب الحاجة لهذه الحملة وكيف سيتم استخدام الأموال',
    
    // Group Creation
    createFamilyGroup: 'إنشاء مجموعة عائلية',
    bringFamilyTogether: 'اجمع عائلتك معاً لدعم بعضكم البعض',
    whatIsGroupFor: 'ما هو الغرض من هذه المجموعة؟ (اختياري)',
    enterEmailAddresses: 'أدخل عناوين البريد الإلكتروني، واحد في كل سطر',
    enterContactInfo: 'أدخل عناوين البريد الإلكتروني أو أرقام الهواتف، واحد في كل سطر',
    inviteLater: 'يمكنك دعوة المزيد من الأعضاء لاحقاً',
    groupPrivacy: 'خصوصية المجموعة',
    groupPrivacyDesc: 'يمكن للأعضاء المدعوين فقط رؤية الحملات والمساهمات داخل هذه المجموعة. يمكن لجميع الأعضاء إنشاء حملات والتصويت على الأولويات.',
    
    // Contribution
    supportFamilyMember: 'دعم أحد أفراد العائلة المحتاجين',
    chooseCampaign: 'اختر حملة',
    campaignDetails: 'تفاصيل الحملة',
    quickAmounts: 'مبالغ سريعة',
    makeRecurring: 'اجعل هذه مساهمة متكررة',
    makePrivate: 'اجعل هذه المساهمة خاصة (مجهولة)',
    nameWillBeHidden: 'سيتم إخفاء اسمك عن أعضاء المجموعة الآخرين. سيظهر فقط "مجهول".',
    canCancelAnytime: 'يمكنك إلغاء المساهمات المتكررة في أي وقت',
    privacyPayment: 'الخصوصية والدفع',
    manualTracking: 'حالياً، يتم تتبع المساهمات يدوياً. سيتم إضافة تكامل الدفع لدعم مناطق وطرق دفع متعددة.',
    privateContribDesc: 'ستظهر المساهمات الخاصة كـ "مجهول" لحماية خصوصيتك مع الاستمرار في احتسابها ضمن هدف الحملة.',
    
    // Campaign
    dueDate: 'تاريخ الاستحقاق',
    dueDateOptional: 'اختياري - حدد موعداً نهائياً لهذه الحملة',
    daysLeft: 'أيام متبقية',
    overdue: 'متأخر',
    vote: 'صوّت',
    voted: 'تم التصويت',
    votes: 'أصوات',
    voteForCampaign: 'صوّت لهذه الحملة',
    removeVote: 'إزالة صوتك',
    votingHelp: 'صوّت لإظهار الدعم والمساعدة في تحديد أولوية هذه الحملة',
    
    // Auth
    login: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    loggingIn: 'جاري تسجيل الدخول...',
    creatingAccount: 'جاري إنشاء الحساب...',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signUp: 'التسجيل',
    backToHome: '← العودة إلى الصفحة الرئيسية',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    emailAlreadyRegistered: 'البريد الإلكتروني مسجل بالفعل',
    passwordsDontMatch: 'كلمات المرور غير متطابقة',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    
    // Landing page
    seeFamiliesSupporting: 'شاهد كيف تدعم العائلات بعضها البعض',
    loginToContribute: 'تسجيل الدخول للمساهمة ←',
    viewAllCampaigns: 'عرض جميع الحملات ←',
    
    // Activity feed
    contributed: 'ساهم',
    to: 'في',
    createdCampaign: 'أنشأ حملة',
    createdGroup: 'أنشأ مجموعة',
    minutesAgo: 'دقائق مضت',
    hoursAgo: 'ساعات مضت',
    daysAgo: 'أيام مضت',
    private: 'خاص',
    anonymous: 'مجهول',
    
    // Group Detail Page - Additional keys
    groupSettings: 'إعدادات المجموعة',
    campaignsInGroup: 'الحملات في هذه المجموعة',
    noCampaignsYet: 'لا توجد حملات بعد',
    createFirstCampaign: 'إنشاء أول حملة',
    totalCampaigns: 'إجمالي الحملات',
    inviteMembersTitle: 'دعوة الأعضاء',
    inviteMembersByEmail: 'دعوة الأعضاء عبر البريد الإلكتروني أو رقم الهاتف',
    emailAddresses: 'عناوين البريد الإلكتروني',
    phoneNumbers: 'أرقام الهواتف',
    onePerLineWithCountry: 'واحد في كل سطر، مع رمز البلد',
    sendInvites: 'إرسال الدعوات',
    inviting: 'جاري الدعوة...',
    saving: 'جاري الحفظ...',
    saveChanges: 'حفظ التغييرات',
    dangerZone: 'منطقة الخطر',
    deleteGroup: 'حذف المجموعة',
    deleteGroupWarning: 'سيؤدي هذا إلى حذف المجموعة وجميع حملاتها نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    invited: 'مدعو',
    admin: 'مسؤول',
    removeMember: 'إزالة العضو',
    inviteMoreMembers: 'دعوة المزيد من الأعضاء',
    
    // Alert Messages
    pleaseEnterEmail: 'الرجاء إدخال بريد إلكتروني أو رقم هاتف واحد على الأقل',
    membersInvitedSuccess: 'تمت دعوة الأعضاء بنجاح!',
    failedToInviteMembers: 'فشل في دعوة الأعضاء',
    memberRemovedSuccess: 'تمت إزالة العضو بنجاح',
    cannotRemoveAdmin: 'فشل في إزالة العضو. لا يمكنك إزالة مسؤول المجموعة.',
    groupSettingsUpdated: 'تم تحديث إعدادات المجموعة بنجاح!',
    failedToUpdateGroup: 'فشل في تحديث إعدادات المجموعة',
    campaignDeletedSuccess: 'تم حذف الحملة بنجاح',
    failedToDeleteCampaign: 'فشل في حذف الحملة',
    groupDeletedSuccess: 'تم حذف المجموعة بنجاح',
    failedToDeleteGroup: 'فشل في حذف المجموعة',
    contributionSuccess: 'تم تقديم المساهمة بنجاح!',
    campaignCreatedSuccess: 'تم إنشاء الحملة بنجاح!',
    groupCreatedSuccess: 'تم إنشاء المجموعة العائلية بنجاح!',
    pleaseLoginToVote: 'الرجاء تسجيل الدخول للتصويت',
    
    // Confirmation Messages
    confirmRemoveMember: 'هل أنت متأكد من إزالة {name} من هذه المجموعة؟',
    confirmDeleteCampaign: 'هل أنت متأكد من حذف "{title}"؟ لا يمكن التراجع عن هذا الإجراء.',
    confirmDeleteGroup: 'هل أنت متأكد من حذف "{name}"؟ سيؤدي هذا أيضاً إلى حذف جميع الحملات في هذه المجموعة. لا يمكن التراجع عن هذا الإجراء.',
    
    // Campaign Pending Messages
    campaignPendingApproval: 'الحملة في انتظار الموافقة',
    needsMoreVotes: 'تحتاج هذه الحملة إلى {count} {votes} أخرى لتصبح نشطة وتبدأ في قبول المساهمات.',
    needsMoreVotesShort: 'يحتاج {count} {votes} أخرى ليصبح نشطاً',
    vote_singular: 'صوت',
    vote_plural: 'أصوات',
    needsVotesBeforeContrib: 'تحتاج هذه الحملة إلى {count} {votes} أخرى قبل أن تتمكن من قبول المساهمات.',
    voteToActivate: 'صوّت أعلاه للمساعدة في تفعيل هذه الحملة.',
    pendingCampaignsDesc: 'تحتاج هذه الحملات إلى 3 أصوات لتصبح نشطة',
    
    // Loading
    loading: 'جاري التحميل...',
    
    // Invite System
    inviteCode: 'رمز الدعوة',
    inviteCodeRequired: 'رمز الدعوة مطلوب',
    enterInviteCode: 'أدخل رمز الدعوة الخاص بك',
    inviteCodeInvalid: 'رمز دعوة غير صالح أو منتهي الصلاحية',
    inviteOnly: 'بالدعوة فقط',
    inviteOnlyDesc: 'هذه منصة عائلية خاصة. تحتاج إلى رمز دعوة للتسجيل.',
    noInviteCode: 'ليس لديك رمز دعوة؟',
    contactAdmin: 'اتصل بمسؤول عائلتك للحصول على دعوة.',
    
    // Profile Settings
    profile: 'الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    profileSettings: 'إعدادات الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updateProfile: 'تحديث الملف الشخصي',
    updating: 'جاري التحديث...',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
    passwordUpdated: 'تم تحديث كلمة المرور بنجاح!',
    profilePicture: 'صورة الملف الشخصي',
    uploadPhoto: 'تحميل صورة',
    removePhoto: 'إزالة الصورة',
    changePhoto: 'تغيير الصورة',
    phoneNumber: 'رقم الهاتف',
    bio: 'نبذة',
    aboutYou: 'أخبرنا عن نفسك',
    currentPasswordWrong: 'كلمة المرور الحالية غير صحيحة',
    passwordsNotMatch: 'كلمات المرور الجديدة غير متطابقة',
    passwordTooShortNew: 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل',
    
    // Invite Management
    manageInvites: 'إدارة الدعوات',
    createInvite: 'إنشاء دعوة',
    inviteCodes: 'رموز الدعوة',
    shareInviteCodes: 'شارك رموز الدعوة مع أفراد العائلة للسماح لهم بالتسجيل. كل رمز يمكن استخدامه مرة واحدة فقط.',
    code: 'الرمز',
    status: 'الحالة',
    usedBy: 'مستخدم من قبل',
    created: 'تم الإنشاء',
    actions: 'الإجراءات',
    copyInviteLink: 'نسخ رابط الدعوة',
    deactivate: 'إلغاء التفعيل',
    deactivated: 'غير مفعل',
    createInviteCode: 'إنشاء رمز دعوة',
    maxUses: 'الحد الأقصى للاستخدامات',
    maxUsesDesc: 'كم مرة يمكن استخدام هذا الرمز (اترك 1 للاستخدام الفردي)',
    expiresIn: 'تنتهي صلاحيته في',
    expiresInDesc: 'كم يوماً حتى تنتهي صلاحية هذا الرمز',
    days: 'أيام',
    confirmDeactivate: 'هل أنت متأكد من إلغاء تفعيل رمز الدعوة: {code}؟',
    inviteCreatedSuccess: 'تم إنشاء رمز الدعوة بنجاح!',
    inviteCopied: 'تم نسخ رابط الدعوة إلى الحافظة!',
    
    // Empty States
    noActiveCampaigns: 'لا توجد حملات نشطة بعد',
    createFirstCampaignBtn: 'أنشئ حملتك الأولى',
    
    // User Management
    activeInvites: 'الدعوات النشطة',
    adminUnlimitedInvites: 'مسؤول - دعوات غير محدودة',
    inviteLimitReached: 'لقد وصلت إلى حد الدعوات (5 دعوات نشطة). قم بإلغاء تفعيل أو انتظر استخدام الدعوات الحالية.',
    userManagement: 'إدارة المستخدمين',
    allUsers: 'جميع المستخدمين',
    makeAdmin: 'جعله مسؤول',
    removeAdmin: 'إزالة صلاحيات المسؤول',
    member: 'عضو',
    confirmMakeAdmin: 'هل أنت متأكد من جعل {name} مسؤولاً؟ سيكون لديه وصول كامل لإدارة المستخدمين والدعوات.',
    confirmRemoveAdmin: 'هل أنت متأكد من إزالة صلاحيات المسؤول من {name}؟',
    userRoleUpdated: 'تم تحديث دور المستخدم بنجاح!',
    onlyAdminsCanManage: 'يمكن للمسؤولين فقط إدارة أدوار المستخدمين',
    
    // Group-specific invites
    optional: 'اختياري',
    generalInvite: 'دعوة عامة (بدون مجموعة)',
    groupInviteDesc: 'إذا اخترت مجموعة، سيتم إضافة المستخدمين الجدد تلقائياً إلى تلك المجموعة',
    forGroup: 'للمجموعة',
  },
  sv: {
    // Landing Page
    appName: 'Amanah',
    tagline: 'Stöd din familj, tillsammans',
    taglineSubtext: 'Amanah betyder "förtroende" - grunden för familjestöd',
    getStarted: 'Kom igång',
    createGroups: 'Skapa grupper',
    createGroupsDesc: 'Bygg privata familjekretsar för att samla resurser och stödja varandra',
    saveTogether: 'Spara tillsammans',
    saveTogetherDesc: 'Bidra regelbundet eller engångsbelopp för att hjälpa familjer i nöd',
    voteSupport: 'Rösta & Stöd',
    voteSupportDesc: 'Bestäm tillsammans vilka familjemedlemmar som behöver hjälp mest',
    
    // Dashboard
    welcome: 'Välkommen',
    logout: 'Logga ut',
    myGroups: 'Mina grupper',
    activeCampaigns: 'Aktiva kampanjer',
    totalContributed: 'Totalt bidragit',
    familiesHelped: 'Familjer hjälpta',
    completedCampaigns: 'Slutförda kampanjer',
    newCampaign: '+ Ny kampanj',
    recentActivity: 'Senaste aktivitet',
    quickActions: 'Snabbåtgärder',
    startCampaign: 'Starta kampanj',
    contribute: 'Bidra',
    createGroup: 'Skapa grupp',
    create: '+ Skapa',
    
    // Campaign
    raised: 'insamlat',
    goal: 'Mål',
    contributors: 'bidragsgivare',
    completed: 'Slutförd',
    active: 'Aktiv',
    pending: 'Väntar på godkännande',
    needsVotes: 'Behöver {count} fler röster för att bli aktiv',
    pendingCampaigns: 'Väntande kampanjer',
    
    // Forms
    campaignTitle: 'Kampanjtitel',
    beneficiaryName: 'Mottagarens namn',
    description: 'Beskrivning',
    targetAmount: 'Målbelopp',
    currency: 'Valuta',
    familyGroup: 'Familjegrupp',
    selectGroup: 'Välj en grupp',
    cancel: 'Avbryt',
    createCampaignBtn: 'Skapa kampanj',
    creating: 'Skapar...',
    
    // Group
    groupName: 'Gruppnamn',
    inviteMembers: 'Bjud in medlemmar',
    inviteByEmail: 'Bjud in via e-post',
    inviteByPhone: 'Bjud in via telefonnummer',
    onePerLine: 'En per rad',
    members: 'medlemmar',
    
    // Contribute
    makeContribution: 'Gör ett bidrag',
    selectCampaign: 'Välj kampanj',
    contributionAmount: 'Bidragsbelopp',
    recurringContribution: 'Gör detta till ett återkommande bidrag',
    frequency: 'Frekvens',
    weekly: 'Veckovis',
    monthly: 'Månadsvis',
    quarterly: 'Kvartalsvis',
    confirmContribution: 'Bekräfta bidrag',
    processing: 'Bearbetar...',
    
    // Navigation
    backToDashboard: 'Tillbaka till instrumentpanelen',
    
    // Campaign Creation
    createNewCampaign: 'Skapa ny kampanj',
    createNewCampaignDesc: 'Starta en insamlingskampanj för att hjälpa en familjemedlem i nöd',
    whoWillReceive: 'Vem kommer att få pengarna?',
    explainCampaign: 'Förklara varför denna kampanj behövs och hur pengarna kommer att användas',
    
    // Group Creation
    createFamilyGroup: 'Skapa familjegrupp',
    bringFamilyTogether: 'Samla din familj för att stödja varandra',
    whatIsGroupFor: 'Vad är denna grupp till för? (valfritt)',
    enterEmailAddresses: 'Ange e-postadresser, en per rad',
    enterContactInfo: 'Ange e-postadresser eller telefonnummer, en per rad',
    inviteLater: 'Du kan bjuda in fler medlemmar senare',
    groupPrivacy: 'Gruppsekretess',
    groupPrivacyDesc: 'Endast inbjudna medlemmar kan se kampanjer och bidrag inom denna grupp. Alla medlemmar kan skapa kampanjer och rösta om prioriteringar.',
    
    // Contribution
    supportFamilyMember: 'Stöd en familjemedlem i nöd',
    chooseCampaign: 'Välj en kampanj',
    campaignDetails: 'Kampanjdetaljer',
    quickAmounts: 'Snabbbelopp',
    makeRecurring: 'Gör detta till ett återkommande bidrag',
    makePrivate: 'Gör detta bidrag privat (anonymt)',
    nameWillBeHidden: 'Ditt namn kommer att döljas för andra gruppmedlemmar. Endast "Anonym" kommer att visas.',
    canCancelAnytime: 'Du kan avbryta återkommande bidrag när som helst',
    privacyPayment: 'Integritet & Betalning',
    manualTracking: 'För närvarande spåras bidrag manuellt. Betalningsintegration kommer att läggas till för att stödja flera regioner och betalningsmetoder.',
    privateContribDesc: 'Privata bidrag kommer att visas som "Anonym" för att skydda din integritet samtidigt som de räknas mot kampanjmålet.',
    
    // Campaign
    dueDate: 'Förfallodatum',
    dueDateOptional: 'Valfritt - Sätt en deadline för denna kampanj',
    daysLeft: 'dagar kvar',
    overdue: 'Försenad',
    vote: 'Rösta',
    voted: 'Röstat',
    votes: 'röster',
    voteForCampaign: 'Rösta för denna kampanj',
    removeVote: 'Ta bort din röst',
    votingHelp: 'Rösta för att visa stöd och hjälpa till att prioritera denna kampanj',
    
    // Auth
    login: 'Logga in',
    createAccount: 'Skapa konto',
    fullName: 'Fullständigt namn',
    email: 'E-post',
    password: 'Lösenord',
    confirmPassword: 'Bekräfta lösenord',
    loggingIn: 'Loggar in...',
    creatingAccount: 'Skapar konto...',
    dontHaveAccount: 'Har du inget konto?',
    alreadyHaveAccount: 'Har du redan ett konto?',
    signUp: 'Registrera dig',
    backToHome: '← Tillbaka till startsidan',
    invalidCredentials: 'Ogiltig e-post eller lösenord',
    emailAlreadyRegistered: 'E-postadressen är redan registrerad',
    passwordsDontMatch: 'Lösenorden matchar inte',
    passwordTooShort: 'Lösenordet måste vara minst 6 tecken',
    
    // Landing page
    seeFamiliesSupporting: 'Se hur familjer stödjer varandra',
    loginToContribute: 'Logga in för att bidra →',
    viewAllCampaigns: 'Visa alla kampanjer →',
    
    // Activity feed
    contributed: 'bidrog',
    to: 'till',
    createdCampaign: 'skapade kampanj',
    createdGroup: 'skapade grupp',
    minutesAgo: 'minuter sedan',
    hoursAgo: 'timmar sedan',
    daysAgo: 'dagar sedan',
    private: 'Privat',
    anonymous: 'Anonym',
    
    // Group Detail Page - Additional keys
    groupSettings: 'Gruppinställningar',
    campaignsInGroup: 'Kampanjer i denna grupp',
    noCampaignsYet: 'Inga kampanjer ännu',
    createFirstCampaign: 'Skapa första kampanjen',
    totalCampaigns: 'Totalt antal kampanjer',
    inviteMembersTitle: 'Bjud in medlemmar',
    inviteMembersByEmail: 'Bjud in medlemmar via e-post eller telefonnummer',
    emailAddresses: 'E-postadresser',
    phoneNumbers: 'Telefonnummer',
    onePerLineWithCountry: 'En per rad, inkludera landskod',
    sendInvites: 'Skicka inbjudningar',
    inviting: 'Bjuder in...',
    saving: 'Sparar...',
    saveChanges: 'Spara ändringar',
    dangerZone: 'Farlig zon',
    deleteGroup: 'Ta bort grupp',
    deleteGroupWarning: 'Detta kommer permanent ta bort gruppen och alla dess kampanjer. Denna åtgärd kan inte ångras.',
    invited: 'Inbjuden',
    admin: 'Admin',
    removeMember: 'Ta bort medlem',
    inviteMoreMembers: 'Bjud in fler medlemmar',
    
    // Alert Messages
    pleaseEnterEmail: 'Vänligen ange minst en e-postadress eller ett telefonnummer',
    membersInvitedSuccess: 'medlem(mar) inbjudna!',
    failedToInviteMembers: 'Misslyckades med att bjuda in medlemmar',
    memberRemovedSuccess: 'Medlem borttagen',
    cannotRemoveAdmin: 'Misslyckades med att ta bort medlem. Du kan inte ta bort gruppadministratören.',
    groupSettingsUpdated: 'Gruppinställningar uppdaterade!',
    failedToUpdateGroup: 'Misslyckades med att uppdatera gruppinställningar',
    campaignDeletedSuccess: 'Kampanj borttagen',
    failedToDeleteCampaign: 'Misslyckades med att ta bort kampanj',
    groupDeletedSuccess: 'Grupp borttagen',
    failedToDeleteGroup: 'Misslyckades med att ta bort grupp',
    contributionSuccess: 'Bidrag skickat!',
    campaignCreatedSuccess: 'Kampanj skapad!',
    groupCreatedSuccess: 'Familjegrupp skapad!',
    pleaseLoginToVote: 'Vänligen logga in för att rösta',
    
    // Confirmation Messages
    confirmRemoveMember: 'Är du säker på att du vill ta bort {name} från denna grupp?',
    confirmDeleteCampaign: 'Är du säker på att du vill ta bort "{title}"? Denna åtgärd kan inte ångras.',
    confirmDeleteGroup: 'Är du säker på att du vill ta bort "{name}"? Detta kommer också ta bort alla kampanjer i denna grupp. Denna åtgärd kan inte ångras.',
    
    // Campaign Pending Messages
    campaignPendingApproval: 'Kampanj väntar på godkännande',
    needsMoreVotes: 'Denna kampanj behöver {count} {votes} till för att bli aktiv och börja ta emot bidrag.',
    needsMoreVotesShort: 'Behöver {count} {votes} till för att bli aktiv',
    vote_singular: 'röst',
    vote_plural: 'röster',
    needsVotesBeforeContrib: 'Denna kampanj behöver {count} {votes} till innan den kan ta emot bidrag.',
    voteToActivate: 'Rösta ovan för att hjälpa till att aktivera denna kampanj.',
    pendingCampaignsDesc: 'Dessa kampanjer behöver 3 röster för att bli aktiva',
    
    // Loading
    loading: 'Laddar...',
    
    // Invite System
    inviteCode: 'Inbjudningskod',
    inviteCodeRequired: 'Inbjudningskod krävs',
    enterInviteCode: 'Ange din inbjudningskod',
    inviteCodeInvalid: 'Ogiltig eller utgången inbjudningskod',
    inviteOnly: 'Endast inbjudna',
    inviteOnlyDesc: 'Detta är en privat familjeplattform. Du behöver en inbjudningskod för att registrera dig.',
    noInviteCode: 'Har du ingen inbjudningskod?',
    contactAdmin: 'Kontakta din familjeadministratör för att få en inbjudan.',
    
    // Profile Settings
    profile: 'Profil',
    editProfile: 'Redigera profil',
    profileSettings: 'Profilinställningar',
    personalInfo: 'Personlig information',
    changePassword: 'Ändra lösenord',
    currentPassword: 'Nuvarande lösenord',
    newPassword: 'Nytt lösenord',
    confirmNewPassword: 'Bekräfta nytt lösenord',
    updateProfile: 'Uppdatera profil',
    updating: 'Uppdaterar...',
    profileUpdated: 'Profil uppdaterad!',
    passwordUpdated: 'Lösenord uppdaterat!',
    profilePicture: 'Profilbild',
    uploadPhoto: 'Ladda upp foto',
    removePhoto: 'Ta bort foto',
    changePhoto: 'Ändra foto',
    phoneNumber: 'Telefonnummer',
    bio: 'Biografi',
    aboutYou: 'Berätta om dig själv',
    currentPasswordWrong: 'Nuvarande lösenord är felaktigt',
    passwordsNotMatch: 'Nya lösenord matchar inte',
    passwordTooShortNew: 'Nytt lösenord måste vara minst 6 tecken',
    
    // Invite Management
    manageInvites: 'Hantera inbjudningar',
    createInvite: 'Skapa inbjudan',
    inviteCodes: 'Inbjudningskoder',
    shareInviteCodes: 'Dela inbjudningskoder med familjemedlemmar för att låta dem registrera sig. Varje kod kan endast användas en gång.',
    code: 'Kod',
    status: 'Status',
    usedBy: 'Använd av',
    created: 'Skapad',
    actions: 'Åtgärder',
    copyInviteLink: 'Kopiera inbjudningslänk',
    deactivate: 'Inaktivera',
    deactivated: 'Inaktiverad',
    createInviteCode: 'Skapa inbjudningskod',
    maxUses: 'Max användningar',
    maxUsesDesc: 'Hur många gånger denna kod kan användas (lämna 1 för engångsbruk)',
    expiresIn: 'Går ut om',
    expiresInDesc: 'Hur många dagar tills denna kod går ut',
    days: 'dagar',
    confirmDeactivate: 'Är du säker på att du vill inaktivera inbjudningskod: {code}?',
    inviteCreatedSuccess: 'Inbjudningskod skapad!',
    inviteCopied: 'Inbjudningslänk kopierad till urklipp!',
    
    // Empty States
    noActiveCampaigns: 'Inga aktiva kampanjer än',
    createFirstCampaignBtn: 'Skapa din första kampanj',
    
    // User Management
    activeInvites: 'Aktiva inbjudningar',
    adminUnlimitedInvites: 'Admin - Obegränsade inbjudningar',
    inviteLimitReached: 'Du har nått din inbjudningsgräns (5 aktiva inbjudningar). Inaktivera eller vänta tills befintliga inbjudningar används.',
    userManagement: 'Användarhantering',
    allUsers: 'Alla användare',
    makeAdmin: 'Gör till admin',
    removeAdmin: 'Ta bort admin',
    member: 'Medlem',
    confirmMakeAdmin: 'Är du säker på att du vill göra {name} till admin? De kommer att ha full åtkomst för att hantera användare och inbjudningar.',
    confirmRemoveAdmin: 'Är du säker på att du vill ta bort admin-rättigheter från {name}?',
    userRoleUpdated: 'Användarroll uppdaterad!',
    onlyAdminsCanManage: 'Endast admins kan hantera användarroller',
    
    // Group-specific invites
    optional: 'Valfritt',
    generalInvite: 'Allmän inbjudan (ingen grupp)',
    groupInviteDesc: 'Om du väljer en grupp kommer nya användare automatiskt att läggas till i den gruppen',
    forGroup: 'För grupp',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key];
}

// Language storage
export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    return (localStorage.getItem('amanah_language') as Language) || 'en';
  } catch (error) {
    console.error('Error loading language:', error);
    return 'en';
  }
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('amanah_language', lang);
  } catch (error) {
    console.error('Error saving language:', error);
  }
}

// Currency conversion rates (approximate)
const conversionRates: Record<string, Record<string, number>> = {
  USD: { USD: 1, SEK: 10.5, SAR: 3.75 },
  SEK: { USD: 0.095, SEK: 1, SAR: 0.36 },
  SAR: { USD: 0.27, SEK: 2.8, SAR: 1 },
};

// Get currency symbol based on language
export function getCurrencyForLanguage(lang: Language): { code: string; symbol: string } {
  switch (lang) {
    case 'sv':
      return { code: 'SEK', symbol: 'kr' };
    case 'ar':
      return { code: 'SAR', symbol: 'ر.س' };
    default:
      return { code: 'USD', symbol: '$' };
  }
}

// Convert amount from one currency to another
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = conversionRates[fromCurrency]?.[toCurrency];
  if (!rate) return amount;
  
  return Math.round(amount * rate);
}

// Format currency amount with proper symbol
export function formatCurrency(amount: number, currencyCode: string, lang: Language): string {
  const targetCurrency = getCurrencyForLanguage(lang);
  const convertedAmount = convertCurrency(amount, currencyCode, targetCurrency.code);
  
  if (lang === 'sv') {
    return `${convertedAmount.toLocaleString('sv-SE')} ${targetCurrency.symbol}`;
  } else if (lang === 'ar') {
    return `${targetCurrency.symbol} ${convertedAmount.toLocaleString('ar-SA')}`;
  } else {
    return `${targetCurrency.symbol}${convertedAmount.toLocaleString('en-US')}`;
  }
}
