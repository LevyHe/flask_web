# CAN 基础学习
## 数据链路层
* CAN的两种数据帧格式

![](./image/can_frame_type.png)

   1. SOF：起始帧，标识一个数据帧的开始，固定一个显性位，只有在总线空闲期间节点才能够发送SOF。
   2. ID：标识符，唯一确定报文ID，确定报文的优先级，ID越小，优先级越高，ID高位先发，标准帧为11位，扩展帧为29位。
   3. DLC：表示数据长度,最高表示8个字节数，大于8的数值也代表8，高位先发。
   4. Data Field： 数据场，0-8个字节，由DLC确认，先发低字节，每个字节先发高位
   5. CRC：用于CRC校验，校验范围从SOFd到数据场结束，CRC包含15个bit
   6. DEL：CRC界定符，固定一个隐性位
   7. ACK：确定报文至少被一个节点正确接收
   8. EOF：结束帧，7个连续的隐性位
   9. IDE：标识符扩展位，IDE=0表示标准帧，IDE=1表示扩展帧
   10. RTR：远程请求位，区分数据帧与远程帧，0表示数据帧，1表示远程帧。
   11. SRR：代替远程请求位，表明该位代替了标准帧中的RTR位，无实际意义，永远置1。
   12. r,r0,r1：保留位，置0
   13. ITM：间歇场，固定3个连续隐性位，在ITM之后，总线进入空闲状态。
   14. 总线空闲：节点检测到11个连续的隐性位，认为总线进入空闲阶段，可以开始发送数据。
* 数据帧的位填充，在SOF之前到CRC之后的界定符DEL为位填充区域，每连续5个相同的bit之后
* 总线错误
   1. 位错误：节点检测到的位于自身发送出的位数值不同，以下两种情况不认为是位错误：
      * 仲裁或ACK位期间送出“隐性位”，而检测到“显性”位不导致位错误
      * 节点在发送被动错误标志时检测到显性位也不认为时位错位
   2. 填充错误：在位填充区域检测到6个或更多连续的相同电平导致填充错误。
   3. CRC校验错误：接收节点计算的CRC序列与接收到的CRC序列不同。
   4. 格式错误：在固定格式场（CRC界定符，ACK界定符，帧结束）检测到一个或更多的显性位。
   5. ACK错误：发送节点在ACK位期间未检测到“显性”位。
   6. 错误检测：
      * 发送节点-位错误、格式错误、ACK错误
      * 接收节点-填充错误、格式错误、CRC错误 
   7. 错误处理：坚持错误->发送错误帧->通知错误报文。错误帧的发送：
      * 位错误、填充错误、格式错误或ACK错误产生后，在当前发送的下一位发送错误帧
      * CRC错误，在紧随ACK界定符后的位发送错误帧，
      * 错误中发送后，总线空闲时自动重发出错的数据帧。
   8. 错误界定：
      * 每个节点都含有REC和TEC
      * 当接收错误产生时，REC增加，正确接收数据帧时，REC减少
      * 当发送错误产生时，TEC增加，正确发送一帧数据时，TEC减少；
      * REC、TEC数值会引发节点状态的改变
   9. 节点的三种错误状态   
    
      ![CAN Error States](./image/can_error_states.png) 

      * Error Active : 正常进行总线通信，错误产生时，发送主动错误帧
      * Error Passive : 能够进行总线通信，错误产生时，发送被动错误帧
      * Bus Off : 总线关闭，不能收发任何报文
# CAN Network layer services (ISO 15765-2 )   
## Terms, definitions and abbreviated terms
|Name|Description|Code|
|-|-|-|
|BS|Block size|
CF | consecutive frame
confirm | confirmation service primitive
ECU | electronic control unit
FC | flow control
FF | first frame
FF_DL | first frame data length 
FS | flow status
indication | indication service primitive
Mtype | message type
N_AE  | network address extension
N_AI  | address information      
N_Ar  | network layer timing parameter Ar
N_As  | network layer timing parameter AS
N_Br  | network layer timing parameter Br
N_Bs  | network layer timing parameter Bs
N_Changeparameter | network layer service name
N_Cr  | network layer timing parameter Cr
N_Cs  | network layer timing parameter Cs
N_Data | network data
N_PCI  | network protocol control information 
N_PCIType | network protocol control information type 
N_PDU | network protocol data unit 
N_SA  | network source address
N_SDU | network service data unit
N_TA  | network target address
N_TAType | network target address type
N_USData | network layer unacknowledged segmented data transfer service name
NWL  | network layer
request | request service primitive
r   | receiver
s   | sender
SF  | single frame
SF_DL | single frame data length 
SN | sequence number
STmin | separation time min
|
## Services provided by network layer to higher layers 
### a) Communication services up to 4095 bytes of data
   1. N_USData.request, request the transfer of data. If necessary, the network layer segments the data.
   2. N_USData_FF.indication, signal the beginning of the segmented message reception to the upper layer.
   3. N_USData.indication, provide received data to the higher layers.
   4. N_USData.confirm, this service confirms to the higher layers that the requested service has been carried out(successfully or not).
### b) Protocol parameter setting services 
   1. N_Changeparameter.request, this service is used to request the dynamic setting of specific internal parameters.
   2. N_Changeparameter.confirm, this service confirms to the upper layer that the request to change a specific protocol has been carried out(successfully pr not).
## Network layer services 
CAN message transmission
![](./image/can_message_frame.png)
   1. General 
      * a service request primitive, used by higher communication layers or the application to pass control information and data to be transmitted to the network layer; 
      * a service indication primitive, used by the network layer to pass status information and received data to upper communication layers or the application; 
      * a service confirmation primitive used by the network layer to pass status information to higher communication layers or the application.
      * All network layers services have the same general format. service primitives are written in the form:
      ~~~
      service_name.type (
                        parameter A,
                        parameter B,
                        parameter C,
                        ...
                        )
      ~~~        
   2. Specification of network layer service primitives

## Network layer protocol
1. Single frame transmission
![](./image/can_unsegemented_message.png)
2. Multiple frame transmission
![](./image/can_multiple_frame.png)
## Network layer protocol data units
1. SF N_PDU is identified by the single-frame protocol control information(SF N_PCI).
2. FF N_PDU 
3. CF N_PDU
4. FC N_PDU
### Protocol data unit field description
   * N_PDU format
    
   |Address information | Protocol control information | Data filed|
   |-|-|-|
   N_AI| N_PCI| N_DATA
   |
   * N_AI 
   * N_PCI
   ![](./image/can_n_pci_bytes.png) 
   what is normal addressing and extended or mixed addressing?
   * SF N_PCI byte
   ![](./image/can_sf_n_pci_byte.png) 
   If SF_DL equal to zero or greater than 7 when using normal addressing, or greater than 6 for extended or mixing addressing, then the network layer shall ignore the received SF N_PDU.
   * FF N_PCI bytes
   ![](./image/can_ff_n_pci_bytes.png)  
   If FF_DL range is greater than the available receiver buffer size ,the network layer shall abort the message reception and send an FC N_PDU with the parameter Flow Status=OverFlow. If the FF_DL is less than 8 ,then the network layer shall ignore the received FF N_PDU and not transmit an FC N_PDU.
   * CF N_PCI byte
   ![](./image/can_cf_n_pci_byte.png)
   The SB shall start with zero and the FF shall be assigned the value zero. The SN of the first CF that immediately follows the FF shall be set to 1. When the SN reaches the value of 15, it shall wraparound and be set to 0 for the next CF. The message reception shall be aborted, and the network layer shall make an N_USData.indication service call with the parameter <N_Result>=N_WRONG_SN to the adjacent upper layer.
   * FlowControl N_PCI bytes
   ![](./image/can_fc_n_pci_bytes.png)  
      **Definition of FS values**

      |Hex value | Description|
      |-|-|
      0| ContinueToSend (CTS)
      1| Wait(WT)
      2| Overflow(OVFLW)
      3-F | Reserved
      |
      FS error handling, the network layer shall make an N_USData.confirm service call with the parameter <N_Result>=N_INVALID_FS to the adjacent upper layer.
      **BlockSize(BS)parameter definition** 
      |Hex value | Description|
      |-|-|
      00| BLockSize(BS) send all remaining consecutive frames.
      01-FF| BLockSize(BS) Receiving ability
      |

      **ST min**
         
      |Hex value | Description|
      |-|-|
      00-7F| Separation time range:0ms-127ms
      80-F0| Reserved
      F1-F9| SeparationTime (ST min) range: 100 µs – 900 µs
      FA-FF| Reserved
      |
      If an FC N_PDU message is received with a reserved ST parameter value, then the sending network entity shall use the longest ST value specified by this part of ISO 15765(0x7F-127ms)instead of the value received from the receiving network entity for the duration of the ongoing segmented message transmission.

   * Network layer timing
   ![](./image/can_network_timing_param.png)  

   * Unexpected arrival of N_PDU
    ![](./image/can_unexpected_arrival_n_pdu.png)
    
## Data link layer usage

   * Normal addressing
![](./image/can_normal_addressing_frame.png)
![](./image/can_normal_fixed_addressing_physical.png)
![](./image/can_normal_fixed_addressing_functional.png)
![](./image/can_extended_addressing_pdu_frame.png)
![](./image./can_mixed_addressing_29bit_physical.png)
![](./image/can_mixed_addressing_29bit_functional.png)
![](./image/can_mixed_addressing_11bit.png)

   * Can Frame Data Length Code(DLC)
      >The DLC is always set to 8.   
   * CAN frame data optimization
      > The DCL parameter of the CAN frame is set by the sender and read by the receiver to determine the number of data bytes per CAN frame to be processed by the network layer. CAN frame data optimization can only be used for a SF,FC frame or last CF of a segmented message. 
   * Data Length Code error handling 
      > The reception of a CAN frame with a DLC value smaller than expected shall be ignored by the network by the network layer without any further action.                
# Unified diagnostic services UDS (ISO 14229-1)
ISO 14229 has been established in order to define common requirement for diagnostic systems, whatever the serial data link is.
![](./image/uds_diagnostic_osi_layers.png)
## Terms and definitions
   * boot manager: part of boot software that executes immediately after an ECU power on or reset whose primary purpose is to check whether a valid application is available to execute as compared to transferring control to the reprogramming software.
   * boot memory partition: area of the server memory in which the tool software is located.
   * boot software: software which is executed in a special part of server memory which is used primarily to boot the ECU and perform server programming.
   * client: function that is part of the tester and that makes uses of the diagnostic services
   * diagnostic data: data that is located in the memory of an electronic control unit which may be inspected and/or possibly modified by the tester.
   * diagnostic routine: routine that is embedded in an electronic control unit and that may be started by a server upon a request from the client.
   * diagnostic service: information exchange initiated by a client in order to require diagnostic information from a server or/and to modify its behaviour for diagnostic purpose. 
   * diagnostic session: state within the server in which a specific set of diagnostic services and functionality is enabled.
   * diagnostic trouble code(DTC) numerical common identifier for a fault condition identified by the on-board diagnostic system.
   * ECU: electronic control unit, containing at least one server.
   * functional unit: set functionally close or complementary diagnostic services
   * integer type: simple type with distinguished values which are the positive and the negative whole numbers,including zero
   * local client: client that is connected to the same local network as the client and is part of the same address space as the client.
   * OSI: open system interconnection
   * permanent DTC: diagnostic trouble code (DTC) that remains in non-volatile memory, even after a clear DTC request, until other criteria(typically regulatory) are met (e.g. the appropriate monitors for each DTC have successfully passed).
   * record: one or more diagnostic data elements that are referred to together by a single means of identification.
   * remote server: server that is not directly connected to the main diagnostic network.
   * remote client: client that is not directly connected to the main diagnostic network.
   * reprogramming software: part of the boot software that allows for reprogramming of the electronic control unit.
   * security: mechanism for protecting vehicle modules from "unauthorized" intrusion through a vehicle diagnostic data link
   * server: function that is part of an electronic control unit and that provides the diagnostic services
   * supported DTC: diagnostic trouble code which is currently/calibrated and enabled to executed under pre-defined vehicle conditions
   * tester: system that control functions such as test, inspection, monitoring, or diagnosis of an on-vehicle electronic control unit and may be dedicated to specific type of operator(e.g. an off-board scan tool dedicated to garage mechanics, an off-board test tool dedicated to assembly plants, or an on-board tester)
## Abbreviated terms
   * .con:    service primitive.confirmation
   * .ind:   service primitive.indication
   * .req:    service primitive.request
   * A_PCI:   application layer protocol control information
   * ECU:     electronic control unit
   * EDR:     electronic data recorder
   * N/A:     not applicable
   * NR_SI:   negative response service identifier
   * NRC:     negative response code
   * OSI:     open system interconnection
   * RA:      remote address
   * SA:      source address
   * SI:      service identifier
   * TA:      target address
   * TA_type: target address type
   ![](./image/can_services_protocol.png) 
   > This part of ISO 14229 defines both confirmed and unconfirmed services. The confirmed services use the six service primitives request, req_confirm, indication, response, rsp_confirm and confirmation. The unconfirmed services use only the request, req_confirm and indication service primitives.

   ![](./image/can_uds_osi_model.png)
## Application layer services
The Server, usually a function that is a part of an ECU, use the application layer services to send response data, provided by the request diagnostic service, back to the client.
* **a service request primitive**, used by the client function in the diagnostic tester application, to pass data about a request diagnostic service to the diagnostics application layer;
* **a service request-confirmation primitive**, used by the client function in the diagnostic tester application, to indicate that the data passed in the service requset primitive is successfully sent on the vehicle communication bus the diagnostic tester is connected to.
* **a service indication primitive**, used by the diagnostic application layer, to pass data to the server function of the ECU diagnostic application.
* **a service response primitive**, used by the server function in  the ECU diagnostic application, to pass response data provided by the requested diagnostic service to the diagnostics application layer. 
* **a service response-confirmation primitive**, used by the server function in the ECU diagnostic application, to indicate that the data passed in the service response primitive is successfully sent on the vehicle communication bus the ECU received the diagnostic request on.
* **a service confirmation primitive**, used by the diagnostics application layer to pass data to the client function in the diagnostic tester application.

![](./image/can_application_layer_service.png) 

![](./image/can_application_layer_service_unconfirmed.png)

### Two Format application layer services, diagnostics and remote diagnostics
   * **A_Mtype, Application layer message type**, range in diagnostic amd remote diagnostic
   * **A_SA, Application layer source address**, 2 byte range in 0x0000-0xFFFF
   * **A_TA, Application layer target address**, 2 byte range in 0x0000-0xFFFF
      * physical addressing
      * functional addressing
   * **A_TA_Type, Application layer target address type**, range in physical and functional
   * **A_Result**, range in ok and error
   * **A_Length**, 4 byte unsigned integer value
   * **A_Data**, string of bytes
### Vehicle system requirements
 The vehicle manufacturer shall ensure that each server in the system has a unique server identifier. The vehicle manufacturer shall also ensure that each client in the system has a unique client identifier.
   * **Optional parameters - A_AE, Application layer remote address**, 2 byte 0x0000-0xFFFF
## Application layer protocol
 ![](./image/can_general_response_behaviour.png)
 ![](./image/can_requset_behaviour_sub.png)