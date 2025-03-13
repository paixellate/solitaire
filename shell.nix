{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
  ];

  # Add TypeScript to PATH explicitly
  shellHook = ''
    export PATH=$PATH:$(npm root -g)/typescript/bin
    
    # Explicitly check TypeScript installation
    if ! command -v tsc &>/dev/null; then
      echo "TypeScript not found, installing..."
      npm install -g typescript
    fi

    echo "Node.js development environment loaded"
    echo "Node version: $(node -v)"
    echo "npm version: $(npm -v)"
    echo "TypeScript version: $(tsc --version)"
  '';
}
