import React, {Component} from 'react';
import ContentLoader from "react-content-loader"



class LoaderComponent extends Component {

  constructor(props) {
       super(props)
       this.state= {
         loading:true,
       }
  }
  componentDidMount()
   {
      setTimeout(() => this.setState({loading: false}), 3000)
   }


render(){
  return(
    <ContentLoader
     height={1000}
     width={400}
     speed={1}
     primaryColor="#f3f3f3"
     secondaryColor="#ecebeb"
      loading= {this.state.loading}
   >
   <rect x="70" y="15" rx="4" ry="4" width="117" height="6" />
      <rect x="70" y="35" rx="3" ry="3" width="85" height="6" />
      <rect x="0" y="80" rx="3" ry="3" width="350" height="6" />
      <rect x="0" y="100" rx="3" ry="3" width="380" height="6" />
      <rect x="0" y="120" rx="3" ry="3" width="201" height="6" />
      <circle cx="30" cy="30" r="30" />
  </ContentLoader>
  )
}
}

export default LoaderComponent;
