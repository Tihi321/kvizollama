use crate::database::disk::get_server_quizes_response;
use std::io::{Error, ErrorKind};
use std::net::IpAddr;
use tiny_http::{Header, Response, Server};

fn get_local_ip() -> Option<IpAddr> {
    local_ip_address::local_ip().ok()
}

pub fn start_server() -> std::io::Result<()> {
    let local_ip = get_local_ip().unwrap_or(IpAddr::from([127, 0, 0, 1]));
    let port = 5318;
    println!("Attempting to start server on all interfaces...");
    println!(
        "Server should be accessible at http://{}:{}/quiz",
        local_ip, port
    );
    println!("You can also access it via http://localhost:{}/quiz", port);

    let server = Server::http(("0.0.0.0", port)).map_err(|e| {
        eprintln!("Failed to bind server: {}", e);
        Error::new(ErrorKind::Other, format!("Failed to bind server: {}", e))
    })?;

    println!("Server successfully bound to 0.0.0.0:{}", port);
    println!("Server is now listening for requests...");

    for request in server.incoming_requests() {
        println!("Received request from: {:?}", request.remote_addr());
        println!("Request method: {}", request.method());
        println!("Request url: {}", request.url());

        let mut response = match request.url() {
            "/" => Response::from_string("Server working"),
            "/quiz" => match get_server_quizes_response() {
                Ok(quizes) => Response::from_string(quizes),
                Err(e) => {
                    eprintln!("Failed to get quizes: {}", e);
                    Response::from_string("Failed to get quizes.").with_status_code(500)
                }
            },
            _ => Response::from_string("Not Found").with_status_code(404),
        };

        // Add CORS header
        let cors_header =
            Header::from_bytes(&b"Access-Control-Allow-Origin"[..], &b"*"[..]).unwrap();
        response.add_header(cors_header);

        // Add Content-Type header based on the request URL
        let content_type_header = match request.url() {
            "/" => Header::from_bytes(&b"Content-Type"[..], &b"text/plain"[..]).unwrap(),
            "/quiz" => Header::from_bytes(&b"Content-Type"[..], &b"application/json"[..]).unwrap(),
            _ => Header::from_bytes(&b"Content-Type"[..], &b"text/plain"[..]).unwrap(),
        };
        response.add_header(content_type_header);

        if let Err(e) = request.respond(response) {
            eprintln!("Failed to send response: {}", e);
        }
    }
    Ok(())
}
