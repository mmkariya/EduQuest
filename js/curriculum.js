"use strict";

(function () {
    const question = (prompt, options, answer) => [prompt, options, answer];

    window.EDUQUEST_CURRICULA = {
        elementary: {
            label: "Elementary",
            subjects: [
                { id: "math", name: "Mathematics", icon: "🧮", description: "Build number sense and solve everyday problems." },
                { id: "english", name: "English", icon: "📖", description: "Practice reading, vocabulary, and clear writing." },
                { id: "science", name: "Science", icon: "🔬", description: "Explore living things, plants, and our planet." },
                { id: "socialStudies", name: "Social Studies", icon: "🌍", description: "Learn about communities, places, and the past." }
            ],
            topics: {
                math: [{ name: "Addition", icon: "➕" }, { name: "Subtraction", icon: "➖" }, { name: "Multiplication", icon: "✖️" }],
                english: [{ name: "Grammar", icon: "📚" }, { name: "Vocabulary", icon: "🔤" }, { name: "Reading", icon: "📖" }],
                science: [{ name: "Animals", icon: "🐾" }, { name: "Plants", icon: "🌱" }, { name: "Earth", icon: "🌎" }],
                socialStudies: [{ name: "Community", icon: "🏘️" }, { name: "Geography", icon: "🗺️" }, { name: "History", icon: "📜" }]
            },
            questions: {
                Community: [
                    question("Who helps keep a community safe?", ["A firefighter", "A baker", "A gardener", "A painter"], 0),
                    question("What is a community?", ["A kind of weather", "A single building", "People who live, work, or learn together in a place", "A type of map"], 2),
                    question("Which place is usually part of a community?", ["Volcano", "Library", "Ocean", "Moon"], 1),
                    question("Why do communities have rules?", ["To stop people from helping", "To make maps", "To change the weather", "To help people live and work together safely"], 3),
                    question("Who can help care for a neighborhood park?", ["Only visitors from another planet", "No one", "Community members", "Wild animals only"], 2)
                ],
                Geography: [
                    question("What does a map help us find?", ["A story's characters", "Places and directions", "The time of day", "A plant's age"], 1),
                    question("Which is a body of water?", ["Mountain", "Valley", "River", "Desert"], 2),
                    question("What is a globe?", ["A kind of compass", "A building", "A weather report", "A round model of Earth"], 3),
                    question("Which direction is opposite north?", ["South", "East", "West", "Up"], 0),
                    question("What do map symbols help explain?", ["How to bake bread", "Places and features shown on a map", "The order of a story", "A person's age"], 1)
                ],
                History: [
                    question("What can we learn from old photographs?", ["Tomorrow's weather", "How to measure a river", "What people or places looked like in the past", "The color of the future"], 2),
                    question("Which item can be a source of information about the past?", ["A new cloud", "A family letter", "A compass direction", "A blank page"], 1),
                    question("What does a timeline show?", ["Places on a map", "The parts of a plant", "The rules of a game", "Events in the order they happened"], 3),
                    question("What is an important reason to learn about history?", ["To understand people and events from the past", "To change yesterday", "To predict every detail of tomorrow", "To avoid asking questions"], 0),
                    question("Which happened first in a person's life?", ["Starting high school", "Being born", "Getting a first job", "Graduating college"], 1)
                ]
            },
        },
        jhs: {
            label: "Junior / Senior High School",
            subjects: [
                { id: "math", name: "Mathematics", icon: "📐", description: "Work with ratios, algebra, and geometric reasoning." },
                { id: "english", name: "English", icon: "📝", description: "Strengthen language, interpretation, and analysis." },
                { id: "science", name: "Science", icon: "🧬", description: "Connect biology, physics, and ecological systems." },
                { id: "socialStudies", name: "Social Studies", icon: "🌏", description: "Explore geography, civics, and historical thinking." }
            ],
            topics: {
                math: [{ name: "Fractions & Ratios", icon: "➗" }, { name: "Algebra", icon: "📈" }, { name: "Geometry", icon: "📐" }],
                english: [{ name: "Grammar", icon: "📚" }, { name: "Vocabulary", icon: "🔤" }, { name: "Reading", icon: "📖" }],
                science: [{ name: "Biology", icon: "🧬" }, { name: "Physics", icon: "⚡" }, { name: "Ecology", icon: "🌿" }],
                socialStudies: [{ name: "Geography", icon: "🌍" }, { name: "Civics", icon: "🏛️" }, { name: "History", icon: "📜" }]
            },
            questions: {
                "Fractions & Ratios": [
                    question("Simplify the ratio 18:24.", ["2:3", "3:4", "4:5", "6:7"], 1),
                    question("What is 3/5 of 40?", ["18", "20", "24", "30"], 2),
                    question("Which fraction is equivalent to 7/8?", ["14/18", "21/24", "28/36", "35/48"], 1),
                    question("A recipe uses 2 cups of rice for 5 people. How many cups for 15 people?", ["4", "5", "6", "8"], 2),
                    question("What is 0.375 as a fraction in simplest form?", ["3/8", "5/8", "3/10", "7/20"], 0)
                ],
                Algebra: [
                    question("Solve: 3x + 7 = 25.", ["x = 4", "x = 5", "x = 6", "x = 8"], 2),
                    question("Simplify: 4(2y − 3) + y.", ["9y − 12", "8y − 3", "9y − 3", "7y − 12"], 0),
                    question("If x = −2, what is x² + 3x?", ["−10", "−2", "2", "10"], 1),
                    question("Which expression means 'five less than twice n'?", ["5 − 2n", "2(n − 5)", "2n − 5", "5n − 2"], 2),
                    question("Solve: 2(x − 4) = 10.", ["x = 1", "x = 5", "x = 9", "x = 14"], 2)
                ],
                Geometry: [
                    question("What is the sum of the interior angles of a triangle?", ["90°", "180°", "270°", "360°"], 1),
                    question("A rectangle is 9 cm by 4 cm. What is its area?", ["13 cm²", "26 cm²", "36 cm²", "72 cm²"], 2),
                    question("What is the circumference of a circle with radius 3? Use π = 3.14.", ["9.42", "18.84", "28.26", "37.68"], 1),
                    question("A right triangle has legs 6 and 8. What is its hypotenuse?", ["9", "10", "12", "14"], 1),
                    question("How many lines of symmetry does a non-square rectangle have?", ["0", "1", "2", "4"], 2)
                ],
                Grammar: [
                    question("Choose the sentence with correct subject-verb agreement.", ["The list of items are long.", "The list of items is long.", "The lists of item is long.", "The list are long."], 1),
                    question("Which word is the subordinating conjunction? “Although it rained, we continued.”", ["it", "rained", "although", "continued"], 2),
                    question("Choose the correct pronoun: “The students submitted ___ projects.”", ["his", "her", "their", "its"], 2),
                    question("Which sentence uses the active voice?", ["The report was written by Ana.", "Ana wrote the report.", "The report is being written.", "The report had been written."], 1),
                    question("Which punctuation completes this sentence? “We packed water, snacks___ and maps.”", [";", ":", ",", "—"], 2)
                ],
                Vocabulary: [
                    question("In “The scientist gave a concise explanation,” what does concise mean?", ["Brief and clear", "Difficult to believe", "Highly detailed", "Unrelated"], 0),
                    question("Which word is closest in meaning to reluctant?", ["Eager", "Unwilling", "Certain", "Careless"], 1),
                    question("What does the prefix “inter-” mean in “international”?", ["Before", "Against", "Between", "Under"], 2),
                    question("Which word is an antonym of expand?", ["Increase", "Stretch", "Contract", "Enlarge"], 2),
                    question("In “The evidence supports the claim,” what does claim mean?", ["A conclusion or assertion", "A type of evidence", "A question", "A disagreement"], 0)
                ],
                Reading: [
                    question("What is the best evidence for a character feeling anxious?", ["She checks the clock repeatedly and taps her foot.", "She eats lunch.", "The room has blue walls.", "It is Tuesday."], 0),
                    question("An author compares a city to a beehive. What does this most likely suggest?", ["The city is quiet.", "The city is busy and active.", "The city is small.", "The city is empty."], 1),
                    question("Which statement is an inference?", ["The passage says it rained.", "The character carries an umbrella, so rain may be expected.", "The title is “Storm”.", "The story has three pages."], 1),
                    question("What is a theme?", ["The central message or insight", "The list of characters", "The time and place", "The sequence of events"], 0),
                    question("Which detail best supports the idea that a narrator is unreliable?", ["The narrator admits forgetting events and contradicts earlier claims.", "The story has dialogue.", "The setting is a town.", "A chapter has a title."], 0)
                ],
                Biology: [
                    question("Which organelle is the main site of cellular respiration?", ["Ribosome", "Mitochondrion", "Nucleus", "Vacuole"], 1),
                    question("Which molecule carries hereditary information?", ["DNA", "Glucose", "Water", "Starch"], 0),
                    question("What is the role of a producer in an ecosystem?", ["Break down rocks", "Make its own food, often using sunlight", "Eat only producers", "Remove all nutrients"], 1),
                    question("Which process produces two genetically similar body cells?", ["Meiosis", "Mitosis", "Fertilization", "Mutation"], 1),
                    question("What happens to an enzyme when its shape changes greatly?", ["It may no longer function properly.", "It becomes a cell.", "It creates DNA.", "It turns into a carbohydrate."], 0)
                ],
                Physics: [
                    question("A 3 kg object accelerates at 4 m/s². What net force acts on it?", ["0.75 N", "7 N", "12 N", "24 N"], 2),
                    question("A cyclist travels 150 m in 10 s. What is the average speed?", ["10 m/s", "15 m/s", "25 m/s", "1500 m/s"], 1),
                    question("Which energy transformation occurs in a battery-powered flashlight?", ["Chemical to electrical to light", "Light to chemical to sound", "Thermal to nuclear", "Mechanical to chemical"], 0),
                    question("If the same force acts on a smaller mass, what happens to its acceleration?", ["It decreases.", "It stays zero.", "It increases.", "It changes into velocity."], 2),
                    question("Which wave property is measured in hertz?", ["Amplitude", "Wavelength", "Frequency", "Speed"], 2)
                ],
                Ecology: [
                    question("What is the most likely effect of removing a top predator from a food web?", ["All populations stay unchanged.", "Some prey populations may increase and disrupt the web.", "Producers immediately disappear.", "Energy flow stops at once."], 1),
                    question("Which is a renewable resource when managed sustainably?", ["Coal", "Natural gas", "Wind", "Petroleum"], 2),
                    question("What does biodiversity describe?", ["The variety of life in an area", "The amount of rainfall only", "A single food chain", "The age of a rock"], 0),
                    question("Why can excess fertilizer cause fish deaths in lakes?", ["It removes all sunlight from the planet.", "Algal blooms can reduce dissolved oxygen.", "It makes water freeze.", "It stops plants from growing."], 1),
                    question("Which action best reduces household waste?", ["Use single-use items more often", "Reuse and recycle suitable materials", "Burn plastic outdoors", "Put batteries in regular compost"], 1)
                ],
                Geography: [
                    question("What do contour lines on a topographic map represent?", ["Changes in elevation", "Political parties", "Population age", "Time zones"], 0),
                    question("Which process moves water from Earth's surface into the atmosphere?", ["Condensation", "Precipitation", "Evaporation", "Infiltration"], 2),
                    question("What is the approximate latitude of the Equator?", ["0°", "23.5° N", "66.5° S", "90°"], 0),
                    question("Why are many major cities located near coastlines or rivers?", ["Access to transport and trade", "They have no weather", "They avoid all hazards", "The land is always flat"], 0),
                    question("What is the main purpose of a map scale?", ["Show distance relationships", "Identify map colors", "Name the mapmaker", "Show north only"], 0)
                ],
                Civics: [
                    question("Why do democratic systems use checks and balances?", ["To concentrate power", "To prevent one branch from becoming too powerful", "To remove elections", "To eliminate laws"], 1),
                    question("Which is a civic responsibility?", ["Ignoring community rules", "Participating thoughtfully in community decisions", "Preventing others from voting", "Avoiding reliable information"], 1),
                    question("What is the purpose of a constitution?", ["Set out fundamental rules and principles of government", "List every private business", "Replace all courts", "Choose every local leader"], 0),
                    question("Which source is most appropriate for checking a proposed law?", ["An official legislative record", "An anonymous meme", "An unrelated advertisement", "A fictional story"], 0),
                    question("What does freedom of expression protect in a democracy?", ["The ability to share opinions within lawful limits", "The ability to ignore every law", "Only government speech", "The right to silence all disagreement"], 0)
                ],
                History: [
                    question("Why do historians compare multiple primary sources?", ["To identify perspective and corroborate evidence", "To make every source identical", "To avoid context", "To replace evidence with guesses"], 0),
                    question("A diary written during an event is what type of source?", ["Primary source", "Secondary source", "Modern encyclopedia", "Fictional summary"], 0),
                    question("What does chronology help historians understand?", ["The order and timing of events", "The color of artifacts", "A source's price", "The author's handwriting only"], 0),
                    question("Why should a historical source be considered in context?", ["Its time and circumstances affect meaning.", "Context always makes it inaccurate.", "It removes the need for evidence.", "Sources have no authors."], 0),
                    question("Which is an example of a secondary source?", ["A later textbook analyzing a past revolution", "A letter written during the revolution", "A soldier's diary", "A law issued at the time"], 0)
                ]
            }
        },
        college: {
            label: "College IT",
            subjects: [
                { id: "programming", name: "Programming", icon: "💻", description: "Apply web standards and programming fundamentals." },
                { id: "algorithms", name: "Algorithms", icon: "🧠", description: "Reason about data structures, search, and efficiency." },
                { id: "databases", name: "Databases & Networks", icon: "🗄️", description: "Practice relational data, SQL, and networking." },
                { id: "cybersecurity", name: "Cybersecurity", icon: "🔐", description: "Build practical security, privacy, and web safety skills." }
            ],
            topics: {
                programming: [{ name: "HTML", icon: "🌐" }, { name: "CSS", icon: "🎨" }, { name: "JavaScript", icon: "💻" }],
                algorithms: [{ name: "Data Structures", icon: "🧱" }, { name: "Searching & Sorting", icon: "🔎" }, { name: "Complexity", icon: "⏱️" }],
                databases: [{ name: "SQL", icon: "🗄️" }, { name: "Data Modeling", icon: "🧩" }, { name: "Networks", icon: "🌐" }],
                cybersecurity: [{ name: "Security Fundamentals", icon: "🛡️" }, { name: "Web Security", icon: "🔒" }, { name: "Privacy & Ethics", icon: "🧭" }]
            },
            questions: {
                HTML: [
                    question("Which element is intended to contain a page's primary, unique content?", ["<section>", "<main>", "<aside>", "<footer>"], 1),
                    question("What does the “alt” attribute provide for an image?", ["A CSS selector", "Alternative text describing the image", "A file download", "A network address"], 1),
                    question("Which element associates a text caption with a form control?", ["<label>", "<legend>", "<caption>", "<summary>"], 0),
                    question("Which attribute connects a label to an input by its id?", ["for", "name", "action", "role"], 0),
                    question("Which markup is semantically appropriate for a self-contained article?", ["<article>", "<span>", "<b>", "<br>"], 0)
                ],
                CSS: [
                    question("In the box model, what does box-sizing: border-box do?", ["Includes padding and border in the declared width", "Removes padding", "Makes width relative to viewport", "Adds margin inside content"], 0),
                    question("Which selector has the greatest specificity?", [".panel", "#panel", "section", "*"], 1),
                    question("Which declaration creates a two-dimensional layout?", ["display: block", "display: grid", "position: fixed", "float: left"], 1),
                    question("What does the CSS cascade use to resolve competing declarations?", ["Only source order", "Origin, importance, specificity, and order", "HTML nesting depth only", "The browser window size"], 1),
                    question("Which unit is relative to the root element's font size?", ["em", "rem", "vh", "px"], 1)
                ],
                JavaScript: [
                    question("What does Array.prototype.map() return?", ["The original array, always mutated", "A new array of transformed values", "A boolean", "The first matching value"], 1),
                    question("Which declaration prevents reassignment of the binding?", ["var", "let", "const", "static"], 2),
                    question("What does Promise.all() do if one input promise rejects?", ["Waits forever", "Rejects with that failure", "Converts all failures to null", "Retries automatically"], 1),
                    question("Which operator checks strict equality without type coercion?", ["==", "===", "=", "!="], 1),
                    question("What is a closure?", ["A function bundled with access to its lexical environment", "A loop that never ends", "A browser tab", "A JSON file"], 0)
                ],
                "Data Structures": [
                    question("Which data structure follows last-in, first-out order?", ["Queue", "Stack", "Graph", "Hash table"], 1),
                    question("Which structure is commonly used for FIFO scheduling?", ["Stack", "Queue", "Tree", "Set"], 1),
                    question("What is a typical average-case lookup time for a well-sized hash table?", ["O(1)", "O(log n)", "O(n log n)", "O(n²)"], 0),
                    question("In a binary search tree, values in the left subtree are typically:", ["Greater than the node", "Less than the node", "Always equal", "Unrelated to the node"], 1),
                    question("Which structure models vertices connected by edges?", ["Graph", "Stack", "Array only", "Queue"], 0)
                ],
                "Searching & Sorting": [
                    question("What precondition does binary search require?", ["The data is sorted", "The data contains unique strings", "The data is a linked list", "The data has even length"], 0),
                    question("What is the average time complexity of merge sort?", ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], 2),
                    question("Which sorting algorithm is generally stable in its standard form?", ["Merge sort", "Heap sort", "Selection sort", "In-place quicksort"], 0),
                    question("How many comparisons does a linear search need in the worst case for n items?", ["1", "log₂ n", "n", "n log n"], 2),
                    question("What is the worst-case time complexity of quicksort with poor pivot choices?", ["O(1)", "O(log n)", "O(n log n)", "O(n²)"], 3)
                ],
                Complexity: [
                    question("Which growth rate is asymptotically faster?", ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], 2),
                    question("What does Big O notation describe?", ["An exact runtime in seconds", "An asymptotic upper bound on growth", "The number of source files", "A programming language"], 1),
                    question("If an algorithm processes each of n items once, its time is typically:", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 2),
                    question("What is the time complexity of two nested loops each running n times?", ["O(n)", "O(2n)", "O(n²)", "O(log n)"], 2),
                    question("Which is typically more scalable for large n?", ["O(n²)", "O(2ⁿ)", "O(n log n)", "O(n!)"], 2)
                ],
                SQL: [
                    question("Which SQL clause filters rows before grouping?", ["HAVING", "WHERE", "ORDER BY", "LIMIT"], 1),
                    question("What does a primary key guarantee?", ["Rows can be uniquely identified", "Every value is text", "Rows are automatically sorted", "The table has no nulls anywhere"], 0),
                    question("Which join returns matching rows from both tables?", ["INNER JOIN", "CROSS JOIN", "FULL TEXT", "UNION ALL"], 0),
                    question("Which statement changes existing rows?", ["INSERT", "UPDATE", "CREATE", "SELECT"], 1),
                    question("Why use a parameterized query?", ["To safely bind values and reduce injection risk", "To sort every table", "To remove indexes", "To encrypt the database automatically"], 0)
                ],
                "Data Modeling": [
                    question("In a relational model, a foreign key represents:", ["A relationship to a key in another table", "A duplicate column", "A database password", "A sorted index"], 0),
                    question("What is a common goal of normalization?", ["Reduce unwanted redundancy and update anomalies", "Store all data in one column", "Remove all relationships", "Make every query slower"], 0),
                    question("In a one-to-many relationship, where is the foreign key usually stored?", ["On the many side", "Only in the parent", "In a separate password table", "Nowhere"], 0),
                    question("What does an entity represent in a data model?", ["A thing about which data is stored", "A query execution plan", "A network packet", "A database transaction"], 0),
                    question("Which constraint prevents duplicate values in a column?", ["UNIQUE", "DEFAULT", "CHECK", "CASCADE"], 0)
                ],
                Networks: [
                    question("What is the primary role of DNS?", ["Translate domain names to IP addresses", "Encrypt every file", "Assign CPU time", "Store web page styles"], 0),
                    question("Which protocol provides reliable, ordered byte-stream delivery?", ["UDP", "TCP", "DNS", "ICMP only"], 1),
                    question("What does HTTPS add to HTTP?", ["TLS-protected transport", "A database", "A different HTML syntax", "A faster CPU"], 0),
                    question("Which device primarily forwards packets between IP networks?", ["Router", "Keyboard", "Repeater only", "Printer"], 0),
                    question("What is an IP address used for?", ["Identifying a network interface for communication", "Naming a CSS class", "Encrypting a password by itself", "Measuring storage capacity"], 0)
                ],
                "Security Fundamentals": [
                    question("What is the main purpose of multi-factor authentication?", ["Make usernames public", "Require more than one kind of proof to sign in", "Disable account recovery", "Share one password across services"], 1),
                    question("Which is the safest way to store account passwords?", ["Reuse one short password", "Write them in a public note", "Use a password manager to create unique passwords", "Send them in plain text"], 2),
                    question("What should you do with an unexpected attachment from an unknown sender?", ["Open it immediately", "Forward it to everyone", "Disable security software", "Verify the sender before opening it"], 3),
                    question("Why are software updates important?", ["They can fix security issues and bugs", "They reveal every password", "They remove the need for backups", "They make all websites private"], 0),
                    question("What is the principle of least privilege?", ["Give every user administrator access", "Give accounts only the access they need", "Share accounts between teams", "Disable access checks"], 1)
                ],
                "Web Security": [
                    question("Why should a website escape untrusted text before inserting it into HTML?", ["To make it load without a network", "To convert it into a password", "To prevent the browser from interpreting it as markup or code", "To increase image resolution"], 2),
                    question("What does HTTPS help protect while data travels to a website?", ["The device from every possible virus", "The confidentiality and integrity of the connection", "A site's content from all copying", "The user's screen brightness"], 1),
                    question("Where should a server-side secret such as an API key be kept?", ["In a public HTML page", "In a visible URL", "In a CSS class name", "In protected server configuration, not public client code"], 3),
                    question("Why validate input on the server even if the browser validates it?", ["Client-side checks can be bypassed", "Browsers cannot display forms", "Server validation changes the page color", "It removes the need for authentication"], 0),
                    question("What is a secure default for access to a new account resource?", ["Allow every visitor", "Deny access until permission is granted", "Trust any supplied account name", "Disable logging"], 1)
                ],
                "Privacy & Ethics": [
                    question("What is data minimization?", ["Collect every possible detail", "Collect only the data needed for a clear purpose", "Keep data forever by default", "Share data without notice"], 1),
                    question("Before using someone's personal data, what should an organization explain?", ["How to hide the collection", "How to avoid securing it", "What is collected and why it is used", "How to sell it anonymously without limits"], 2),
                    question("What is a responsible way to share a dataset for a class project?", ["Post names and contact details publicly", "Use data without checking permission", "Disable access controls", "Remove or protect identifying personal information"], 3),
                    question("What should you do if you discover a possible security issue in a service?", ["Report it through the service's authorized channel", "Publish private user data", "Try it on unrelated systems", "Use it to access other accounts"], 0),
                    question("Why are accessibility and inclusive design ethical concerns?", ["They only affect decoration", "People with different abilities should be able to use the product", "They remove the need for privacy", "They make content unavailable"], 1)
                ]
            }
        }
    };
})();
