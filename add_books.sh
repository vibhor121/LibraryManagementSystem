#!/bin/bash

# Admin token (you may need to update this)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTQ5ZTcxN2JkNjYyMTMwNjZhMmEzYyIsImlhdCI6MTc1OTgxMzM4NywiZXhwIjoxNzYwNDE4MTg3fQ.kyt-7r54vaTQy48dTyTEviay6o3wOhfPiYZrKKamvgg"

# Function to add a book
add_book() {
    local title="$1"
    local author="$2"
    local isbn="$3"
    local genre="$4"
    local description="$5"
    local price="$6"
    local year="$7"
    local publisher="$8"
    
    echo "Adding: $title by $author"
    
    curl -X POST http://localhost:5000/api/books \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"title\": \"$title\",
            \"author\": \"$author\",
            \"isbn\": \"$isbn\",
            \"genre\": \"$genre\",
            \"description\": \"$description\",
            \"price\": $price,
            \"publicationYear\": $year,
            \"publisher\": \"$publisher\",
            \"totalCopies\": 3
        }" | jq '.success, .message'
    
    echo "---"
    sleep 1
}

# Add books
add_book "1984" "George Orwell" "9780451524935" "Dystopian Fiction" "A dystopian social science fiction novel about totalitarian control and surveillance." 349 1949 "Secker & Warburg"

add_book "Pride and Prejudice" "Jane Austen" "9780141439518" "Romance" "A romantic novel about Elizabeth Bennet and Mr. Darcy in Georgian England." 299 1813 "T. Egerton, Whitehall"

add_book "The Catcher in the Rye" "J.D. Salinger" "9780316769174" "Fiction" "A coming-of-age story about teenager Holden Caulfield in New York City." 329 1951 "Little, Brown and Company"

add_book "Lord of the Flies" "William Golding" "9780571056866" "Fiction" "A story about British boys stranded on an uninhabited island and their disastrous attempt to govern themselves." 279 1954 "Faber and Faber"

add_book "The Hobbit" "J.R.R. Tolkien" "9780547928227" "Fantasy" "A fantasy novel about a hobbit who goes on an unexpected journey to help dwarves reclaim their homeland." 449 1937 "George Allen & Unwin"

add_book "Harry Potter and the Philosopher's Stone" "J.K. Rowling" "9780747532699" "Fantasy" "The first book in the Harry Potter series about a young wizard's adventures at Hogwarts." 599 1997 "Bloomsbury"

add_book "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe" "C.S. Lewis" "9780064471046" "Fantasy" "A fantasy novel about four children who discover the magical world of Narnia." 399 1950 "Geoffrey Bles"

add_book "The Alchemist" "Paulo Coelho" "9780061122415" "Fiction" "A philosophical novel about a young Andalusian shepherd's journey to find his personal legend." 349 1988 "HarperCollins"

add_book "The Kite Runner" "Khaled Hosseini" "9781594480003" "Fiction" "A story about friendship, betrayal, and redemption set in Afghanistan." 399 2003 "Riverhead Books"

add_book "The Book Thief" "Markus Zusak" "9780375831003" "Historical Fiction" "A story about a young girl in Nazi Germany who steals books and shares them with others." 449 2005 "Knopf"

echo "All books added successfully!"
