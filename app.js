warning: in the working copy of 'profile.html', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/profile.html b/profile.html[m
[1mindex c3e2844..ee0c1d3 100644[m
[1m--- a/profile.html[m
[1m+++ b/profile.html[m
[36m@@ -15,159 +15,174 @@[m
     <!-- Sidebar -->[m
     <aside class="sidebar">[m
 [m
[31m-        <h1 class="logo">EduQuest</h1>[m
[32m+[m[32m        <h1 class="logo">Edu<span>Quest</span></h1>[m
 [m
         <nav>[m
             <a href="index.html" class="nav-item">🏠 Dashboard</a>[m
[32m+[m[32m            <a href="profile.html" class="nav-item active">🧙 Profile</a>[m
             <a href="quests.html" class="nav-item">🗺️ Quests</a>[m
             <a href="#" class="nav-item">🏆 Rewards</a>[m
             <a href="#" class="nav-item">📊 Progress</a>[m
             <a href="#" class="nav-item">⚙️ Settings</a>[m
         </nav>[m
 [m
[31m-    </aside>[m
[32m+[m[32m        <!-- Mini player widget (uses the shared player data) -->[m
[32m+[m[32m        <div class="sidebar-player">[m
[32m+[m[32m            <span class="mini-avatar" data-avatar>👤</span>[m
[32m+[m[32m            <div>[m
[32m+[m[32m                <div class="mini-name" data-display="name">Player</div>[m
[32m+[m[32m                <div class="mini-level">Lv <span data-display="level">1</span></div>[m
[32m+[m[32m            </div>[m
[32m+[m[32m        </div>[m
 [m
[32m+[m[32m    </aside>[m
 [m
     <!-- Main Content -->[m
     <main class="main-content">[m
 [m
         <!-- Top Bar -->[m
         <header class="topbar">[m
[31m-[m
             <div>[m
                 <h2>Profile</h2>[m
[31m-                <p>Manage your EduQuest player profile.</p>[m
[31m-            </div>[m
[31m-[m
[31m-            <div class="profile">[m
[31m-                👤 <span id="topbar-name">Player</span>[m
[32m+[m[32m                <p>Your EduQuest adventurer profile.</p>[m
             </div>[m
 [m
[32m+[m[32m            <a href="profile.html" class="profile-chip">[m
[32m+[m[32m                <span class="chip-avatar" data-avatar>👤</span>[m
[32m+[m[32m                <span data-display="name">Player</span>[m
[32m+[m[32m            </a>[m
         </header>[m
 [m
[31m-[m
[31m-        <!-- Profile Card -->[m
[32m+[m[32m        <!-- Profile / RPG Character Sheet -->[m
         <section class="profile-page">[m
 [m
[31m-            <!-- Profile Header -->[m
[31m-            <div class="profile-header">[m
[31m-[m
[31m-                <div class="avatar" id="profile-avatar">[m
[31m-                    👤[m
[31m-                </div>[m
[32m+[m[32m            <div class="character-sheet">[m
 [m
[31m-                <div>[m
[31m-                    <h1 id="profile-name">Player</h1>[m
[31m-                    <p id="profile-title">EduQuest Adventurer</p>[m
[31m-                </div>[m
[31m-[m
[31m-            </div>[m
[31m-[m
[31m-[m
[31m-            <!-- Player Statistics -->[m
[31m-            <div class="profile-stats">[m
[31m-[m
[31m-                <div class="profile-stat">[m
[31m-                    <span>⭐</span>[m
[32m+[m[32m                <!-- Profile Header -->[m
[32m+[m[32m                <div class="profile-header">[m
[32m+[m[32m                    <div class="avatar" data-avatar>👤</div>[m
 [m
                     <div>[m
[31m-                        <p>Points</p>[m
[31m-                        <h3>0</h3>[m
[32m+[m[32m                        <h1 data-display="name">Player</h1>[m
[32m+[m[32m                        <div class="profile-title" data-display="title">EduQuest Adventurer</div>[m
[32m+[m[32m                        <span class="level-badge" data-levelbadge>Lv 1</span>[m
[32m+[m[32m                        <span class="grade-badge">🎓 <span data-display="gradeLevel">College</span></span>[m
                     </div>[m
                 </div>[m
 [m
[31m-[m
[31m-                <div class="profile-stat">[m
[31m-                    <span>🎮</span>[m
[31m-[m
[31m-                    <div>[m
[31m-                        <p>Level</p>[m
[31m-                        <h3>1</h3>[m
[32m+[m[32m                <!-- Level & XP Progress -->[m
[32m+[m[32m                <div class="profile-level-block">[m
[32m+[m[32m                    <h3>🛡️ Adventure XP</h3>[m
[32m+[m[32m                    <div class="xp-bar-track">[m
[32m+[m[32m                        <div class="xp-bar-fill" data-progressbar></div>[m
                     </div>[m
[32m+[m[32m                    <div class="xp-label" data-xptext>0 / 100 XP</div>[m
[32m+[m[32m                    <div class="xp-to-next" data-xptonext>100 XP to Level 2</div>[m
                 </div>[m
 [m
[32m+[m[32m                <!-- Player Statistics -->[m
[32m+[m[32m                <div class="profile-stats">[m
 [m
[31m-                <div class="profile-stat">[m
[31m-                    <span>🏆</span>[m
[31m-[m
[31m-                    <div>[m
[31m-                        <p>Quests Completed</p>[m
[31m-                        <h3>0</h3>[m
[32m+[m[32m                    <div class="profile-stat">[m
[32m+[m[32m                        <span class="stat-icon">⭐</span>[m
[32m+[m[32m                        <div>[m
[32m+[m[32m                            <p>Points</p>[m
[32m+[m[32m                            <h3 data-display="points">0</h3>[m
[32m+[m[32m                        </div>[m
                     </div>[m
[31m-                </div>[m
[31m-[m
[31m-            </div>[m
[31m-[m
[31m-[m
[31m-            <!-- Progress -->[m
[31m-            <div class="profile-progress">[m
 [m
[31m-                <h2>Adventure Progress</h2>[m
[32m+[m[32m                    <div class="profile-stat">[m
[32m+[m[32m                        <span class="stat-icon">🎮</span>[m
[32m+[m[32m                        <div>[m
[32m+[m[32m                            <p>Level</p>[m
[32m+[m[32m                            <h3 data-display="level">1</h3>[m
[32m+[m[32m                        </div>[m
[32m+[m[32m                    </div>[m
 [m
[31m-                <p>Level 1</p>[m
[32m+[m[32m                    <div class="profile-stat">[m
[32m+[m[32m                        <span class="stat-icon">🏆</span>[m
[32m+[m[32m                        <div>[m
[32m+[m[32m                            <p>Quests Completed</p>[m
[32m+[m[32m                            <h3 data-display="quests">0</h3>[m
[32m+[m[32m                        </div>[m
[32m+[m[32m                    </div>[m
 [m
[31m-                <div class="progress-bar">[m
[31m-                    <div class="progress-fill"></div>[m
                 </div>[m
 [m
[31m-                <small>0 / 100 XP</small>[m
[31m-[m
[31m-            </div>[m
[31m-[m
[31m-[m
[31m-            <!-- Edit Profile Button -->[m
[31m-            <button class="edit-profile-btn" id="edit-profile-btn">[m
[31m-                ✏️ Edit Profile[m
[31m-            </button>[m
[31m-[m
[31m-[m
[31m-            <!-- Edit Profile Form -->[m
[31m-            <div class="edit-profile-form" id="edit-profile-form">[m
[31m-[m
[31m-                <h2>Edit Profile</h2>[m
[32m+[m[32m                <!-- Achievements -->[m
[32m+[m[32m                <div class="achievement-section">[m
[32m+[m[32m                    <h2>🎖️ Achievements</h2>[m
[32m+[m[32m                    <p class="achievement-count">[m
[32m+[m[32m                        <strong data-display="achievements">0</strong> unlocked[m
[32m+[m[32m                        so far[m
[32m+[m[32m                    </p>[m
 [m
[31m-                <label for="name-input">Player Name</label>[m
[31m-                <input[m
[31m-                    type="text"[m
[31m-                    id="name-input"[m
[31m-                    placeholder="Enter your name"[m
[31m-                >[m
[31m-[m
[31m-[m
[31m-                <label for="title-input">Profile Title</label>[m
[31m-                <input[m
[31m-                    type="text"[m
[31m-                    id="title-input"[m
[31m-                    placeholder="Enter your profile title"[m
[31m-                >[m
[31m-[m
[31m-[m
[31m-                <label for="avatar-input">Avatar</label>[m
[31m-[m
[31m-                <select id="avatar-input">[m
[31m-                    <option value="👤">👤 Player</option>[m
[31m-                    <option value="🧙">🧙 Wizard</option>[m
[31m-                    <option value="🧑‍🚀">🧑‍🚀 Explorer</option>[m
[31m-                    <option value="🦸">🦸 Hero</option>[m
[31m-                    <option value="🧑‍🎓">🧑‍🎓 Scholar</option>[m
[31m-                </select>[m
[31m-[m
[31m-[m
[31m-                <div class="edit-buttons">[m
[32m+[m[32m                    <div class="achievement-list" id="profile-achievements">[m
[32m+[m[32m                        <!-- Filled by js/profile.js -->[m
[32m+[m[32m                    </div>[m
[32m+[m[32m                </div>[m
 [m
[31m-                    <button[m
[31m-                        type="button"[m
[31m-                        class="save-profile-btn"[m
[31m-                        id="save-profile-btn">[m
[31m-                        💾 Save Changes[m
[31m-                    </button>[m
[32m+[m[32m                <!-- Edit Profile Button -->[m
[32m+[m[32m                <button class="edit-profile-btn" id="edit-profile-btn">[m
[32m+[m[32m                    ✏️ Edit Profile[m
[32m+[m[32m                </button>[m
[32m+[m
[32m+[m[32m                <!-- Edit Profile Form -->[m
[32m+[m[32m                <div class="edit-profile-form" id="edit-profile-form">[m
[32m+[m
[32m+[m[32m                    <h2>Edit Profile</h2>[m
[32m+[m
[32m+[m[32m                    <label for="name-input">Player Name</label>[m
[32m+[m[32m                    <input[m
[32m+[m[32m                        type="text"[m
[32m+[m[32m                        id="name-input"[m
[32m+[m[32m                        placeholder="Enter your name"[m
[32m+[m[32m                    >[m
[32m+[m
[32m+[m[32m                    <label for="title-input">Profile Title</label>[m
[32m+[m[32m                    <input[m
[32m+[m[32m                        type="text"[m
[32m+[m[32m                        id="title-input"[m
[32m+[m[32m                        placeholder="Enter your profile title"[m
[32m+[m[32m                    >[m
[32m+[m
[32m+[m[32m                    <label for="avatar-input">Avatar</label>[m
[32m+[m
[32m+[m[32m                    <select id="avatar-input">[m
[32m+[m[32m                        <option value="👤">👤 Player</option>[m
[32m+[m[32m                        <option value="🧙">🧙 Wizard</option>[m
[32m+[m[32m                        <option value="🧑‍🚀">🧑‍🚀 Explorer</option>[m
[32m+[m[32m                        <option value="🦸">🦸 Hero</option>[m
[32m+[m[32m                        <option value="🧑‍🎓">🧑‍🎓 Scholar</option>[m
[32m+[m[32m                        <option value="🧚">🧚 Fairy</option>[m
[32m+[m[32m                    </select>[m
[32m+[m
[32m+[m[32m                    <label for="grade-input">Grade Level</label>[m
[32m+[m
[32m+[m[32m                    <select id="grade-input">[m
[32m+[m[32m                        <option value="Elementary">Elementary</option>[m
[32m+[m[32m                        <option value="Junior High School">Junior High School</option>[m
[32m+[m[32m                        <option value="Senior High School">Senior High School</option>[m
[32m+[m[32m                        <option value="College">College</option>[m
[32m+[m[32m                    </select>[m
[32m+[m
[32m+[m[32m                    <div class="edit-buttons">[m
[32m+[m
[32m+[m[32m                        <button[m
[32m+[m[32m                            type="button"[m
[32m+[m[32m                            class="save-profile-btn"[m
[32m+[m[32m                            id="save-profile-btn">[m
[32m+[m[32m                            💾 Save Changes[m
[32m+[m[32m                        </button>[m
[32m+[m
[32m+[m[32m                        <button[m
[32m+[m[32m                            type="button"[m
[32m+[m[32m                            class="cancel-profile-btn"[m
[32m+[m[32m                            id="cancel-profile-btn">[m
[32m+[m[32m                            Cancel[m
[32m+[m[32m                        </button>[m
 [m
[31m-                    <button[m
[31m-                        type="button"[m
[31m-                        class="cancel-profile-btn"[m
[31m-                        id="cancel-profile-btn">[m
[31m-                        Cancel[m
[31m-                    </button>[m
[32m+[m[32m                    </div>[m
 [m
                 </div>[m
 [m
[36m@@ -177,8 +192,8 @@[m
 [m
     </main>[m
 [m
[31m-[m
[31m-    <!-- JavaScript -->[m
[32m+[m[32m    <!-- JavaScript (shared player data first) -->[m
[32m+[m[32m    <script src="js/app.js"></script>[m
     <script src="js/profile.js"></script>[m
 [m
 </body>[m
