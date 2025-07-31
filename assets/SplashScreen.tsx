import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

const { width, height } = Dimensions.get('window');

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: SplashProps) => {
  // Animation values (keep all existing animations)
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const bottomImagePosition = useRef(new Animated.Value(height)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Keep all existing animation code exactly the same
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bottomImagePosition, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sloganOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bottomImagePosition, {
          toValue: height,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('Login');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Change only the background color to white
  const bgColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Keep all other elements exactly the same */}
      <View style={styles.centerContent}>
        <Animated.Image
          source={{
            uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoICAgICgkKCAgLDQoIDQgICQgBAwQEBgUGCgYGCg0NCg4NDQ0NEA4NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0QDQ0NDQ4NDQ0NDQ0ODQ0NDQ0IDQ0NCAgNDf/AABEIANcA6AMBIgACEQEDEQH/xAAdAAEAAgIDAQEAAAAAAAAAAAAABwkGCAMEBQEC/8QARxAAAgEDAgMEBQgGBwgDAAAAAQIDAAQRBRIGEyEHCCIxCRRBUWEVIzJCU3GBkhhSkZXR0yQzVXKhosEWQ2JjgpOx0jSUsv/EABsBAQADAQEBAQAAAAAAAAAAAAABAgMFBgQH/8QAMxEAAgIABQIDBgMJAAAAAAAAAAECEQMEEiExQVEFYXETIjKRocEGgbEUIzNCUoLR4fH/2gAMAwEAAhEDEQA/ALU6UpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKV5XFXE8FlbT3dy4jgt4nmlc/VSMbmwB1Y+xVGSzEAAkgVWvZ+kG1yPULi7XlS2U0paPTbhECwQABUjjuIRzUmKBTJIzXEZkLsIsEASlZDdFntKiLsD7zencQRH1djBdxjM9jOVE8YzjmIQSs8BJGJY/LcodYmOypdqCRSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSvlal9unes1S2N5NotvYanpkEZtpruCV5p9Mv4pJVuGvrdfEISnLMJ2CLEbStcMsscdSlZDdEV+kL7f8A1icaDavmC2ZJdQZfKS5GHgts5wVt/DNIMEc5oRlWt5FrTCv3cXTOzSOxkkkdpJJGOWkkkYvJI7fWd3YuzfWYk+2vc4C4GudTvLewtF3T3MgjTIysY6tJNJ1HzUMYaV8HO1CBliqnVbIxbs2L9H/2JS32pDVnMkdppbnlsrbPWLySIrycqd3Lhhk5kwG0PzIEO9HmSrLqxXsu7OLfSbC20+1XEVvHt3EDfLISWlmkwADJNIzSOQANzHAAAAyqsm7NkqQpSlQSKUpQClKUApSlAKUpQClKUApSlAKUrF+Ku0e1s/DK+6TGeVGA0n4jIVM+zey59maxxcbDwY68SSS7t0DKKVDc/eJXPhtGI97TBT+wRuP81e1oPbvaSkLKr25P1mw8f4uvUfeyAD31y4eM5OctKxFfmml82kiupElUrjgnVgGUhlYAhgQQQfIgjoQfeK5K7Kd7osKUpUgUpXj8YcWQWFrcXl0/Lt7aJ5pXwSQiDJCqOrOxwqooLOxVQCSBQEGd9Dt0k0yxjsLHc2rasfVrRIussaOyxyTIMjErGRYLfrkzSBwGEMgEBdonYFa8JaJZ6lFf3VlxCuyJXtJVeK7mlO97R7eUcl7O1j3ZfYA6xKzpOzRxHO+7LwxLrGo3nGmsKIY15kelRSlQlvawh1acsSQEgjMkSvlVeVr2faA8LDU7vOduz6/qb3I3Czg3QafGwKlYNwLTMrdVlumUSuCFKosMbDMOTdIyb6nZkvtI1vPN9X0DVmzidQy6FfyEbt1wgDtpErsDmaPmWxJZ3BeRVGxXcL4EOmarqNrqNlPDqZtle2nMTSWrWKuvOMF3GGtyJpXt2yJMyhAoAaCZRomiEkAAsSQAqqWZiegVVUFmZjgBVBJJAAOatx7pfY/NoujQW1zLJJcyE3E0byu8do0qqBaW6M7JFHCiqHWHakk5nlAHNqZER5JmpSlZmwpSlAKUpQClKUApSlAKUpQClKUApSuG8ugiM7HCorMx9wUEk/gBUN0rYI97Wu0g2qiCE/0iQZLefKQ9N2P1267QegwSfqhoz7M+BWv5meUsYUO6ViTukc9dm7zy30nbOQPcXUjFNf1priaWd/pSOWx57R5Kg+CqAo+ArZLhPRzY2AVULyJE0rov0pJipcoOnnnEa9PILX53gTfi2beJifwobpfpt3fL+XYxXvMw/tE7ttpeBntp7nTLnptmtHBiyDnx2U4ls3DHo5WGOVgcc1ehGofadqOvcOSquq28N/ZuQsWo2qtAsh6+GQeNYZ9o3ch0VW6hJptjsu+PZ/xg15CzvFyZEco0eSTjarK2CFYBg2BkddpIyK7fF+lW11EbK7iWeG7DQtE67kdQjO279XaFyGBBV9pBBwR655XJ5rDU5Qi4vh1pe+3Oz8qLuKfBqv3fu8zbSNsilZoj1ltJPDNDnGZI0yQwUnxcpnRs9SGwa3AtbpXVXRgyOoZWByGUjIIPuI61UP3iOxa44b1UwpI/IfNzptyCVkMO7BRmGMXFuxEUhXoymKTCCcRruP3GO8f8pRvpt0wF5AhljPQCaLIDsg8gVZgXRegLEjarKqzlsrPJvRGTlhPi+YPtfWL6dn6kRdbG21KUrrGgrTrvAalLxRrcPC1nIy6fYsl3rtwgbGUZWS2VwQu9c7VB3f0lw+M6fKpmLvSduB0TTt0A5mpXriz0uALvaS6lwqvyx9NYSyttJAkkMMO5WnSoz0e3h4E4blubgrPq943Mm3yF2u9TmVmWHmt43gthveSQDcyrcTbeZOQZKMj7v5dtcVpbxcMabsijWGIXyxeFYbVVX1awUL0HNQLJKpIxAIkKuty2NLuEOE7i/ureytUElxcyCKJS2xc4LM7tg7Y4o1eWRgrFY0dgrYweprWtTXM0txcSNLPPI8s0rnLPJIxZmOMAZJ6KoCqMKoUAAST3dlfnayYt3PXhjW2tjHnmrPy4F3Q7fEJRA04Qr1yQB1IrXgzbs9CPtJ0jRJl+S7O21W7tHVvlrUzK1q9xGwbmafp8M0UaQRyAGC6mmeZsbgSux32Q7DvSOesTw22s28EKzukaX9nzBBG7napuIJZJnjhLYUzpPIIywZ0SMSSxx56Oe001tTvPWxAbxYIDpomCn60wu2gDeHnBfVwCvjEZk2+Ey15vpEbTS11aH1MQC4a2k+VBDjbv3J6uZgngFwYubzM/OGMW+7w8qq8uiVtuWb5r7Wu/Y53lLZZdO0HUXMOqDSdJd5ZGXlTXtxZxvNaE53R3SkrIEkAEolQIzNlK2IrM1TsUpShIpSlAKUpQClKUApSlAK68d+hZkDoXXBZAwLKD5blByM+zIGa568LTeDIIrmW6QNzZgQ+WyvUqWwvs3FVJ8/LpjyrHEc046Uqve3VLfjZ2/LYHp2k74cyhEAdtpVywMQ+i7Equ1iOpXqB+saxvtQ1EDTrl0IIaMICDkESOsZwR59GNejxrw765ayQLJsL7cN5jwsr4YAjKttwevkfbjBwbWeCWtNGuYDJzGyJSQCFXEsbFVBydoCEn3ksema5WdxcVQxMOMbj7Kb12vip7Vz+ZDIc4XtBJdW6HqHnhU/cZFB/wzW3NakcJ3QS6tnPktxCT9wkXP+Ga2R4944SwhEjIZGZtiIDtycZJLYOFAHU4JyQMdennPw5i4eDgY2JN0k1fpW31syw9kd7WtGZmE0JCXCDAJzslTOTDLjqUJ+iwBaNjuGQXR8P0btLt7q+hQb0KxSxqGA2tM5jYgMrMDtWNlDdA244Jyuf1wl2ky6gGjhjWCRRmR2bmBEPQGNcKXcnIw+1U6MS/RD5l3wPY6XIl7JJO4VwsUeEPzjKxycKmcAMwyVAx7egPXxsy8RRx8s17LUniOWypNbq6drr512Zpd8GFd/Xs0F9oE1wqjn6WwvkY9PmF8N4pOD4fVi823yZ4Is4xkVt9mfaFLpOoWmoxbi1pMsrIvnLD1WeEZIGZoGkjGTgMwb6tXN6naRXtpJGcNDd27Icjo0VxGV6g9cFH6g1R8tu6eCQYdfC49zr0YfgwIr1MakikuS9DTdQSWNJY2DRyosiMPJkcBlYfAqQfxpqOopDG8srrHHEjSSSOQqoiKWd2J6BVUFiT5AGoc7mHE3rXDOkt1HJgezwfPFjNLZp+2OFCPgaj/vi9pdndpLwymqw6fezJDLI1ysi2cytvZNOub2Js2TXGI5GdlYGMohB9ZVWijS9jj7ErFuINWn4tvgY9PtBLa6BDN4VWCMstxqUivjY7kOAWClTzFYMLa3kOnfep7fG1/U2mjLCwtQ0FghGMx5HMumHmHumVWwcFYkgUqrLJmYe873jriPSIOHl0qXRJmj5F5Adr2xsIURUi024jOy5tLnKo8oHhjR4XTMpK6dVeK6mTZ8ZsdT0A8yfIVsppevycI6XbvDsXiHWfV7uRZUV/UNGilEkVvNDICQ2pMjJMoET8tpVDxyWkMhxDu49nsMr3WsahGz6ToaC7uEUEm7uV8drZL5IwZwskwZtix8tZAEuCwjvj3jq51S9uL+5JkuLqUuVTLhQcLFBCANzJGgSGMBdzBVzuZiTbnYjgk2w7FrDiCSR9EuLayk5LXNzoupCZI7KOM/PyWuoRwywT2KMyctJY4JIVKhyu9ETzdF4P0bStlzfX9jrEsfzltpWjyST2c8ikGI32pNFFDHahsGS3hjlkmHTxJzI3k/iPsqv9I0RdKs7cTaprCesa2Y57Q3NvaRgG30iG2Fwt3OX3lp+RDcK558fiWeEJqvLEVLKwKsrMrKwKsrKSrKynBVlYFWUgEEEHGKhEHp8WcVT311Pe3T77m5laaVwNo3nGAgySiRqFSNdx2IiLk7c1YJ3J+9odRVNI1KXOoRofVLhz1voo1yyOx+ldwoCxz4p4lMniaOdqrmrs6XqssEsc8EjQzQuksMqHDxyRsGR1yCMqwBwQQfIggkGzVkp0Xn0qLO7Z22R69pUN4AqXCEwXsS+UV1GF37RkkRyqyTxZJIjlQNhgwEp1gbilKUApSlAKUpQClKUB0tZMvKk5G3nbG5e8ZUvjwg9R0J6ef7fKtVNd4luZ2PrEsrEEgoxIVSDgjljCqQehAUVtxUado/ZAt0xmtysc5+krdI5fiSMlX/4sEN7QPpV5bx7I4+ZgpYLbq7jfPn2tf886TVrYgG0uXjO6NmjI+sjFCPxUg1IPDva1I0b2t43NhmRoubjMkYdSu44/rFGcnPjHnlsBaxe/4OvLdvFBOhHk6qzL+Eke5f2NmvX0I3Eh2yaeLpfazQtA4HxuUEeP70pf7xXhMm8fBnpTlF8NOMmn5NLf6N9jFWjDGXBI9oyOhyPwPt+BrYe2sotZsIt7FZEI3MuNyTKu1sqehVwd20/VZTkEAiKOOeE441juLcDkP4XVZRPyZhkFDIpYMrY6MCRuDLnIAPS4F45lsZd6eKN8CWMnAYDyIPsdcnBwfMg9D0+nJYqyONLBzKvDkkpc1XMZLh/fnqiYvS6ZNfC3Zb6kpaC4bnH6TOimJ1HkjRghgAeu5JFbPtI8NcHH/E8a27R3sOxy8e0bedFJtdSxik2gZC7vDKIn8+hBBOT8McbW12uYZAWxlo28Mif3k88ezcuVPsJr88Y8FQ30axzbhsbcrIQGU4wfMMCCD1BB9nuFe+ll4/srjkqprZXcXfPff8+fiN+mx6GharFPDHLCQYmHgwMdB4cY6YKkFSPZjFUsdpEIXUtSQdAmo36Ae4JdzKP8BV03D+hR20KQRAhEBAyckkkkkn2lmJJ8h16ADAqlvtMkzqmqN+tqeot+a8nP+tdvA1aVrrVSuuL615FJFjHo77otw4q/Z314g/6mWX/zITVd/a1G41TURLdrfyC9uRJeLnbcMJWBcBvogY2bFzHHt2Rs6KjNvh3JtEebhC7ije4ie4m1FUktGiS6UtEkQa2ecNCk4ZcRtKNivtJ6daroubBomaJ05bxM0TxnGY3jYo8Zx0yjKVOOmRW0eWQ+ESRwJ24SwW66dqEEeq6R0AsblmWS1GCvM027X56ykVT4VQmPAKqkZdpK979HldT2zcNXA1CJ3jWWwumjt9U03msEVryMHlz2qvkNeWodQAcJII5JKi7g7g261C5is7KFri5mLCOJSiltiM7EvIyRoqorEtI6qMefUZ397i/dcn0wz6pqluYL999tawO6SNb2+RzZWMTPFzbl1Cja77YYwQw9YkQWexCVmxPYx2TW+i6bb6fB4hEpM0pHiuLh/FNO3njmPnauSI0CRjwooERd47sJ0mztL3X7Wwih1PT7a5u4JYQY4hcLE+27mtl/o00tsx9aSSSIsJIkYk7a2Wriu7VZFZHVXR1KOjAMrKwwyspyCrAkEEYIOKys1aKvOGO75o9zwle65cahI2qIt5KY2uIiPWopJBBaTLMpmkuL7ETcySTe7XKOpZeskUdo05nttJvZX33d1aTpcsTukm9Rvbizt7qZjl5JpIIltnldmMhs9xJcyE74an6NnQJLr1hZdQhhLbvU45oeSB7Ykle3e7SJuuQLjeucK6YGMg7b+49peqQxeq5066tbeO2tpItzwciENyoJ7dmw0al2bmRtHLuYkvINyNdSRm4lW1KzHtU7IdQ0W59V1CAxOQWilQl7e4QdC9vNhQ4BI3KQkkeV3pHuXOHVoUNj+4h2unTdaS1kfFrqoW1cE4VboZazk6nzZy9qAOrG4TOdgxaTVFUF08bLJExjljZZIpBjMciENG65BGUcBhkHqBV1/Zlxmuo6dY36jaLy0guNp80MsauyHGRlGJQ9T1BrKSNYsyalKVQuKUpQClKUApSlAKUpQHl69qzwqhSCSctKkZWPGUVvORs/VXHX7xkgZIi7t94kcGK1QkLIpkkA838W1F+IBDEr7Tt91TLXXewQsHKIXAwHKgsB7g2MgfAGuZncpPMYcsOM9Oqul0lyuj39fuQ9yN+z7hoQ2Uz34VEnVQyS+FY4EBEakHGwlmZgOjAspPjLVHnFfZkyL6xZt61aNkhoyHeMA4IYL1YKem5RkYO4LjJnvivhpLuB4JCyq+07lxuBVgykZBB6gdCOorj4Q4USzgWBCzAFmLNjLMxyT0AAHkAB7B7Tknj4/g0cVRy7j7kYbTv39V7quqfP6UVcb2NUIZypDKSpByrKSCD7wR1H4VnnD/bVew4Dstwg9ko8f4SLg/i4kNS9xR2VWl0SxTlSn/eRYUk+9lwUY/Fl3fEVFuvdg93Hkwslwvuzy5Pysdh/CTJ91ean4X4hkJOWA213g/1j/pmemS4M20Xt6tH6TLJAfeRzE/Mg3/iYwK0h457iOozSz3Omahp+prLLPO0e82lyDJI0gQRu08TN4iC0k8AyM4GTtmrU9GmgO2aKSI/8alc/cSMN94JrpoxBBBwR1BHQj7iK2wPxJmcF6caCl3/ll/j6EOfdEs9y3gO703QILW+t3tbpbi9aSF2jdlDXUvLO6F5I2DxBHBR2GGGcHIEMy+jXjk1K4mm1OVtPlMkqqkaLfc6VmZleVla32IxL8xYMyBtmyPZzJM40TtSvoMBZ2dR9Sb50H4ZbxgD3K61JHDfb7E5C3MZiPlzI8un3lfpqPu5n4V6XK/iHK4zqTcH58fPj50XUovY4exTus6VoT8+0jdrtrWK1luZXZ3cId0siqSVha5cI0qQhEPKiAUbSWmCutYajHKoeN1dG8mUhgfxH/j2V2a9IpKStO0ailKVIFKUoDFO0zsxstXtJLK+hEsL9QfKSKQAhZoZPOOVMnDDzBKkMrMpqZ7fexC50DUGs5yZInBltLnbtW5g3Y3e4SxEhJowfAxVvoSxM1yNQX3y+yNdW0O52puu7FWvrQgZcvApaWFeq59Zg5kIBO0SNE5BMa1aLoq1ZU3Vo/o++IDNw3BGWLNaXV5bnJyQDM1yi/csdyiqPYoUeyqtwasU9GRMfknU19g1VmH/VY2QP/wCRV5cGceTcWlKVkbClKUApSlAKUpQClKUApSlAKUpQCvlfaUBj3aJq/q+n31wESQ29pczqkg3I7QwvIquB1KkqAQCDjOMVozw5309Eutq6lpNxYOxwZ9OlSeFRjO94mEDqCem2OG4YfEZI3k7SNPM2nX8Q85bK6jH3vBIv+tUjW75VT7wD+0VjiZXCx1WLFS9VZnItJj7PYLi0tb6yvYntr2KKe1N0rWryRTIJI8CRVYOyMDseKJl8iAc1i+t8M3FsQJ4mjz9Fjgo3t8Miko3TrgMTWV9j1tpqaFoF1esHdNE0+JID4gwjhGW5QwXyxIO88sYGcedZ/Z6tf35URW0NvY9Mi5j3iVMYwI/DlcYICbVGOkp8q8DnPCcv7WUMPaV+7GDc3XeSfwr+70srpTIc4X4wns33wvgH6cZ6xyf3l9/uYYYewjrWx3A/HUV9HuTwuuBJETlkPvHluQ9drY69QQCCBEfaT2Yxws72jBgi75rbcGkhQ/7xRkuYs+e7qvnkj6OEcM8RSWsyTRnqp8Q9jofpI3wYfsOG81FfHlM5mPCsb2ONvC/VV/VH7r5qyqbi6ZtzSulo2rJPFHNGcpIoZff19h9xB6Eewgiu7X6dGSklKO6e6PoFKUqwFcdxGCrBvIgg/cR1/wAK5KjvvC9oI0vRdRvSQHjtnSDOcNczfMWynGThp5IwcDoMnyBNAUzWqqFUKcqAApznKgdDn25GDmrIPRnWDLo1/IR0k1aTb8VSyslJ/PuH4VXDDEFAUeQAA+4DAq2HuN8Lta8M6fvxuuefeHHtS5nkkgP/ANcw5/1rWT2MY8k9UpSsjYUpSgFKUoBSlKAUpSgFKUoBSlKAUroTa9ApKtNErA4IMiAg+4gnINIdegYhVmiZicACRCSfcADkn7qA7skYIIPUEYI94PnVIvHfCJ0++vLEqy+p3U9su7zMcMjJE/3SRBJFPtVgfbV3lV6ekU7D2huU12BPmLnlW9/tH9XcqFitp3wPozxhLYsxAV4oFGTOKtHkpImnus8T2B4b0m8u1Uy28c9lGGBdv6LdTIuxOq7tgRw7AbQw6rmpP+WNT1Hpbr6jbH/fPnmuvvTyPl1GzaP+aa1Y9HPx3bsl/pd0EYwP8q2vMw21SiQXexSDtERWCTpnJndsDaTW1l32mz3TGLTIGk9jXMoKxJ8QDjrg5G8g/wDLevO55KGI9c6jLiOGv3k3W9tb+W1bfEyEenpPCVjpimeRwZCCGnmOXYt1ZUUe1vcoZiPMtUJcd6PFHKstv1trlTLD0xtw22SPB8jG/s+qGUew1Mmjdkis4nv5Wu5v1WJ5K+3AXpuAPswqH7OuDtx0JWsVdVC+ryIQAAAEf5sqAPIZZD0/VrkeIZGWJlJP2ccOMVqilvLzcmtt1yt3dNvYSVo6vd+1ktbzQE/1MgZfgkoJx+dHP/VUq1CPd2B33fu2wftzLj/Wpurs+Bzc8lht+a/JSaX0LR4FKUrvFhVd3pEu28XN1Fotu+YbJhPelScPdshEUOQQGFvC7O6kMvMmTqHt2A2h71/eLj0DTyYmjbUroPHYwt1AYYElzIg6mG3DBiOgkcxx7l5hdam7q6aR3kkZnkkd5JHY5Z5JGLyO5PVnd2ZmY9SST7avFdTOT6Ho8J8KS391bWUGeddzxW8ZA3bDK4TmED6kQJlfqMIjHIxmrtNA0SO2ggtoVCQ28McESDoFjiQRooA6AKqgdPdWgPo5uxgz3c2tzJ8zaB7az3Do91IuJ5lyvlBA3JDKSrNcSg4aHpYbSTJihSlKoXFKUoBSlKAUpSgFKUoBSlKAUpSgNEfSE92dH3cRWkKblRV1VVjBZ40CpFfEgZJgjVYZ2bOIViclEt5CdFbD5qRJYvmpYnSSOSPCSRyRsHSRGHVXRgGVh1BANXqTQBgVYBlYEMpGQQRggg9CCOhB6EVWZ3v+6I+jySahp0ZbSXbdJGgLHTmY/RYdf6GT/Vv5Q/1bYAjZ9IvoZyXU2p7pXexi1yFbS7ZItWhT5xOipeIo63NuPLOOs0I6xNkgGMq1T/ruhQ3UMtvcRJNBOjRTRSKHjkjcbWR1PQqQcEVR7p+oyQyJLDI8UsbB45Y2ZJI3X6Lo6kMrD2FSDW93d49ITGyx2mvnlyAKianGnzUhztHrkMa/MOehaeJeQfGzJaqviOPYKXcxntA7o2rcN38escPCS/t7aVpha9Xu4oiG5ls6L4r62eMvBujVrnayZjldDcHcjsQ7VrDV7JZ7HEXKYw3NmVEc9jcqAZLW4hABikTIIyAJEKyLuV1JzXSNYiuIkmgljmhlUPHLE6yRyIfJkdCVZT7CpIr8DQYecbgRRicqEMwUCVkByEZwAzID1CMSoPUAHrWb3dvkulR36xjtMh3WF0PdCzfiuGH+IrJ68HjqzeS0niQZeVOWo9mZCEBPwGck+wZNfLmlqwZpdYyX0ZJhnYBpGy1kmI6zS4HxSIbR/nMgqUa6GhaOtvDHCn0Y0VB7zgdWPxY5Y/Emu8TWeRy/7PgQwuqW/ry/qQlSPtRn279vlloFobi5bfM4YWtojATXMi46KOuyJCy82YgrGCPpM0aPFneC79On6WJLbTzHqOoDK4Rs2ds4JU+sTocSOhBzbQMXyNrtb7leq5OO+PLvU7qS9vp3uLiXALt0VEGdsUSDwxQpk7Y0AAJZjuZ3Zugo2Vcux2e0vtHutXvZr+9ffPNgADIjhiUnlW8KknZDEGO1c5LM7sWeSR25eynsxudZv4NPtAObMSzyEFkt4EI51xIBjwRBh0yu92jjBDSrXm8GcGXWo3UVlZQtPczHCRr7AMbpHbyjijBy8jYVR8SAbWu7N3cLfh6zKArNfXAVr26xjmMoO2KLPiS3hywRTgsS8jeJyBo3RRKyQezvgK30uytrC0TZBbRiNB03MfpPJIQBullkLSyNjxO7H21kdKVibClKUApSlAKUpQClKUApSlAKUpQClKUAriuLdXVkdQysCrKwDKysMEEHIIIJBBBBFctKA0L7x3o+2UvecPoCpLPLpbOF25yx9Qkc7Qu7ytJXVVBIikVUjt60i1DT5IZHimjkhmjbbJFKjRSxtgHbJG4V0bBBwyg4I99Xo1Hnav2A6TrSAahaJLIoxHcITFdRDIOEuIysmzIBMTFo2wNyN5VdSM3HsVL9nna1qekuX069ntNxyyIwaBycZaS2lWS3dyABvaIuB0DCtnOCfSXX8QVdQ062u+viltpXtHC+w8pxco7+/Dwqfctc/aP6NO7jJfSb+K5T2QXwME4HXOLiFHhlYnGAYLYDr4q144s7tfEFl/8AI0i+xkjdBF64n3lrI3CqD55Yr8ceVW2ZXdG62j+ks0V+k1lqkB9/KtJE/Apd7z+MYr1L/wBI1w+i5RNRmP6qWsan9s08S/5qrO1aFrdttwrQN5bZ1MLZ/uyBT/hXS+VovtY8noBvXOT5DGfbU6ENbN/OK/SdR4xYaTKSc+O+uI4tvuPKthcb+vmOfH99azdqXen13WFaO7vTHbt0a0s1NtbsMEEOAzzzIwODHPPKhwDtBrB9D7OtRuiPVtPv7jcQAYLO4lXr73SNkA+JIHxqZuBu4bxHeEGW3h0+LIy95OhcofNkhtvWHLD9SbkZPtHnUUkLbNeFXHQdBUpdiPdt1TX5B6pFy7UNiW/nDLax4ba4jIw1zKuGHJh8mAEjwBg9bu9lPo8tIstsmoM2rTDGUmQRWQOCD/RFZzKpBwUuprhDgHYpFbSWlokaqkaqiIAqoihVVQMBVUABQB0AAAFQ5diVHuRl2D93PTuH4GjtEMlxKF9avZcGe4K+S5HSKFDkpBHhFJZjvd5JHlOlKzNRSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKVxz3CqCzMFUeZYgAfeT0FAclK8//AGht/t4f+6n/ALU/2ht/t4f+6n/tQGB95DtPOj6Lf3yECaOLl22RuHrVwwgtyV+sqSyLIw6eBGOQATVVfC/brrdkc22r6inTye6luEz5luVctNFuJ6ltmW9pNb7d9js91HXIrC002SxNvDLLc3LTXqQkzKnKtlRQH3KEluWfdjDGLGcHGqX6DOu/r6X+8U/l1eLSMpcnFpHfp4miXa99Fc/G4srQnHuPIigyB8evxrvN3+eIvqvYRn9ZLFA3+aRh/hXW/QZ139fS/wB4p/Lp+gzrv6+l/vFP5dT7pS35mO633veJrjcH1i4VWz4YI7W22g+xXt7eOYffzC3xqVu4Z25XSa2bK8u7m5i1OJkU3U89yy3durTRMHmdygkhFwjkn5xhACcqorC/0Gdd/X0v94p/Lrv8P9zriOzuILu3fSufazw3MIOpqqmSCRZUV2WIkIzKFfAOVLDBzgrXBKbLSKV5kPEcBAJmhU4GRzYzg46jIbBx5ZFfv/aG3+3h/wC6n/tWZuehSutaalHJnZIj489jq2M+WcE4zXZoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFQ33xIweGNYBAINpgg9QRzY/MGpkroa5oMF1E9vcwxXEEo2yQzRrLFIuc7XjcMjrkA4YEdKAot+TY/s4/yL/CnybH9mn5F/hVkvbf6PuDU71bnT7qz0e3W1igNnBpSsjTJLcO9wTDd2ibpEljjIMRIEC+NgQqYTp3oxJUkjdtbhkVJEdozpTYkVXDMhzqTAB1BU5Vh18j5VrrMdBoh8nR/Zp+Rf4U+To/s0/Iv8Kud/Rz4f8A7C0f922f8mn6OfD/APYWj/u2z/k1GsnQUxfJ0f2afkX+FPk6P7NPyL/Crnf0c+H/AOwtH/dtn/Jp+jnw/wD2Fo/7ts/5NRrGgpi+To/s0/Iv8KfJ0f2afkX+FXO/o58P/wBhaP8Au2z/AJNP0c+H/wCwtH/dtn/JprGgpi+TY/s4/wAi/wAKfJsf2afkX+FWR9tvo+YdSvludPurPR7cWsUBs4NKVozLHJO73GYbu1TdIsscZHKLYhXLsCFTDNL9GLKksTvrcMiJLG7xnSWxIiOrNGSdSYASKChJVgM9VbyNtZGg8r0XFoi3WulVVSbfSwSqgZxJqOM4HXGTj7zVg1Yzwj2Yabp7SPYafZWTTBFma0tYLdpVjLmNZDCiFxGZJCobIXe+MbjnJqzbtmqVIUpSoJFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgP//Z',
          }}
          style={[
            styles.logo,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
              color: '#2E7D5F',
            },
          ]}
        >
          PathoCare
        </Animated.Text>
        <Animated.Text
          style={[
            styles.slogan,
            {
              opacity: sloganOpacity,
              color: '#607D8B',
            },
          ]}
        >
          Precision Diagnostics for Better Health
        </Animated.Text>
      </View>

      <Animated.Image
        source={{
          uri: 'https://img.freepik.com/premium-vector/thanks-doctors-nurses-physician-nurses-staff-profession-occupation-medical_24640-62408.jpg',
        }}
        style={[
          styles.bottomImage,
          {
            transform: [{ translateY: bottomImagePosition }],
          },
        ]}
        resizeMode="contain"
      />
      
      <Animated.Text style={[styles.versionText, { opacity: sloganOpacity }]}>
        Version 1.0.0
      </Animated.Text>
    </Animated.View>
  );
};

// Only change the container background in styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: 'white', // This ensures a fallback white background
  },
  // Keep all other styles exactly the same
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.25,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'sans-serif-condensed',
    textShadowColor: 'rgba(76, 175, 130, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slogan: {
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '500',
    maxWidth: '80%',
    lineHeight: 22,
  },
  bottomImage: {
    width: width * 0.9,
    height: height * 0.3,
    marginBottom: 20,
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 12,
    color: '#90A4AE',
  },
});

export default SplashScreen;