;; stacksmemer.clar
;; Stacks Memer Platform Contract

(define-data-var admin principal tx-sender)

;; Error codes
(define-constant err-not-admin (err u100))
(define-constant err-token-exists (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-already-voted (err u103))

;; Data maps
(define-map tokens 
  { contract-id: principal } 
  {
    name: (string-ascii 64),
    symbol: (string-ascii 16),
    creator: principal,
    votes: uint,
    created-at: uint
  }
)

(define-map token-votes 
  { contract-id: principal, voter: principal } 
  { voted: bool }
)

;; Register a new meme token
(define-public (register-token (contract-id principal) (name (string-ascii 64)) (symbol (string-ascii 16)))
  (let
    (
      (existing (map-get? tokens { contract-id: contract-id }))
    )
    (asserts! (is-none existing) err-token-exists)
    (map-set tokens 
      { contract-id: contract-id }
      {
        name: name,
        symbol: symbol,
        creator: tx-sender,
        votes: u0,
        created-at: block-height
      }
    )
    (ok true)
  )
)

;; Vote for a token
(define-public (vote-token (contract-id principal))
  (let
    (
      (token (unwrap! (map-get? tokens { contract-id: contract-id }) err-token-not-found))
      (has-voted (default-to { voted: false } (map-get? token-votes { contract-id: contract-id, voter: tx-sender })))
    )
    (asserts! (not (get voted has-voted)) err-already-voted)
    
    ;; Record the vote
    (map-set token-votes { contract-id: contract-id, voter: tx-sender } { voted: true })
    
    ;; Increment vote count
    (map-set tokens { contract-id: contract-id } 
      (merge token { votes: (+ (get votes token) u1) })
    )
    
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-token (contract-id principal))
  (map-get? tokens { contract-id: contract-id })
)

(define-read-only (get-votes (contract-id principal))
  (let ((token (map-get? tokens { contract-id: contract-id })))
    (if (is-some token)
      (ok (get votes (unwrap-panic token)))
      err-token-not-found
    )
  )
)

(define-read-only (has-voted (contract-id principal) (voter principal))
  (default-to { voted: false } (map-get? token-votes { contract-id: contract-id, voter: voter }))
)
