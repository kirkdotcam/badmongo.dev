if  node --version ; 
then 
  echo "node installed";
else
  echo "installing node.js"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  nvm install 22
  node -v
  npm -v 

fi

if java -version ;
then
  echo "java installed";
else
  sudo apt install openjdk-8-jdk-headless;
fi

git clone https://github.com/johnlpage/POCDriver.git

if mvn --version ;
then
  echo "maven installed"
else
  echo "installing maven and appending PATH"
  curl -OL https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz 
  tar -xzvf apache*
  mkdir -p ~/opt/
  rm *.tar.gz
  mv ./apache-maven* ~/opt/
  export PATH="$HOME/opt/apache-maven-3.9.9/bin:$PATH"
fi

cd POCDriver
mvn clean package
cd bin
cp POCDriver.jar ~
cd ../.. 
